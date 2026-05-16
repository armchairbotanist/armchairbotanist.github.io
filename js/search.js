(function () {
  const { state, els, utils } = window.AB;
  const { normalizeSearch, rankWeight, capitalize, escapeHtml } = utils;

  function init() {
    els.searchInput.addEventListener("input", renderSearchResults);
    els.searchInput.addEventListener("focus", renderSearchResults);
    els.clearSearch.addEventListener("click", () => {
      els.searchInput.value = "";
      closeSearch();
      els.searchInput.focus();
    });

    document.addEventListener("click", (event) => {
      if (!event.target.closest(".search-panel")) closeSearch();
    });
  }

  function renderSearchResults() {
    const queryText = els.searchInput.value.trim();
    const query = normalizeSearch(queryText);
    if (!query) {
      closeSearch();
      return;
    }

    const localResults = localSearch(query);
    renderSearchList(localResults, {
      pending: query.length >= 3,
      emptyText: "No local match yet."
    });

    queueTaxonLookup(queryText);
  }

  function localSearch(query) {
    return state.searchIndex
      .map((node) => ({ node, score: scoreNode(node, query), type: "local" }))
      .filter((result) => result.score > 0)
      .sort(compareSearchResults)
      .slice(0, 12);
  }

  function renderSearchList(results, options = {}) {
    const { pending = false, emptyText = "No matches found." } = options;

    if (!results.length && !pending) {
      const empty = document.createElement("p");
      empty.className = "search-empty";
      empty.textContent = emptyText;
      els.searchResults.replaceChildren(empty);
      els.searchResults.classList.add("is-open");
      return;
    }

    const items = results.map(renderSearchResult);
    if (pending) {
      const pendingMessage = document.createElement("p");
      pendingMessage.className = "search-empty";
      pendingMessage.textContent = results.length ? "Checking broader taxon names..." : "Checking taxon names...";
      items.push(pendingMessage);
    }
    els.searchResults.replaceChildren(...items);
    els.searchResults.classList.add("is-open");
  }

  function renderSearchResult(result) {
    const { node } = result;
    const button = document.createElement("button");
    button.className = "search-result";
    button.type = "button";
    const matchText = result.matchText ? `<span class="search-match">${escapeHtml(result.matchText)}</span>` : "";
    button.innerHTML = `
      <strong>${escapeHtml(node.name)}</strong>
      <span>${escapeHtml(capitalize(node.rank))} / ${escapeHtml(node.pathString || "Plant tree")}</span>
      ${matchText}
    `;
    button.addEventListener("click", () => {
      els.searchInput.value = "";
      closeSearch();
      window.AB.tree.revealNode(node.id, { highlight: true });
    });
    return button;
  }

  function queueTaxonLookup(queryText) {
    window.clearTimeout(state.searchLookupTimer);
    state.searchLookupSeq += 1;

    if (normalizeSearch(queryText).length < 3) return;

    const lookupSeq = state.searchLookupSeq;
    state.searchLookupTimer = window.setTimeout(async () => {
      const currentQueryText = els.searchInput.value.trim();
      const currentQuery = normalizeSearch(currentQueryText);
      if (!currentQuery || currentQuery !== normalizeSearch(queryText)) return;

      try {
        const taxonResult = await resolveTaxonSearch(currentQueryText);
        if (lookupSeq !== state.searchLookupSeq || normalizeSearch(els.searchInput.value) !== currentQuery) return;
        const results = mergeSearchResults(localSearch(currentQuery), taxonResult ? [taxonResult] : []);
        renderSearchList(results, {
          pending: false,
          emptyText: "No matching family or order found."
        });
      } catch (error) {
        console.warn("Taxon search unavailable", error);
        if (lookupSeq !== state.searchLookupSeq) return;
        renderSearchList(localSearch(currentQuery), {
          pending: false,
          emptyText: "No matching family or order found."
        });
      }
    }, 260);
  }

  function mergeSearchResults(localResults, taxonResults) {
    const merged = [];
    const seen = new Set();
    for (const result of [...taxonResults, ...localResults]) {
      if (!result?.node || seen.has(result.node.id)) continue;
      seen.add(result.node.id);
      merged.push(result);
    }
    return merged.sort(compareSearchResults).slice(0, 12);
  }

  function closeSearch() {
    window.clearTimeout(state.searchLookupTimer);
    state.searchLookupSeq += 1;
    els.searchResults.classList.remove("is-open");
    els.searchResults.replaceChildren();
  }

  async function resolveTaxonSearch(queryText) {
    const query = normalizeSearch(queryText);
    if (state.taxonSearchCache.has(query)) return state.taxonSearchCache.get(query);

    const params = new URLSearchParams({
      q: queryText,
      is_active: "true",
      per_page: "8"
    });
    const response = await fetch(`https://api.inaturalist.org/v1/taxa/autocomplete?${params.toString()}`);
    if (!response.ok) {
      state.taxonSearchCache.set(query, null);
      return null;
    }

    const data = await response.json();
    const result = await bestTreeMatchForTaxa(query, data.results || []);
    state.taxonSearchCache.set(query, result);
    return result;
  }

  async function bestTreeMatchForTaxa(query, taxa) {
    const sortedTaxa = [...taxa]
      .filter((taxon) => taxon.iconic_taxon_name === "Plantae" || includesPlantAncestor(taxon))
      .sort((a, b) => taxonQueryScore(b, query) - taxonQueryScore(a, query));

    for (const taxon of sortedTaxa) {
      const direct = matchTreeNodeByTaxonNames([
        taxon.name,
        taxon.matched_term,
        taxon.preferred_common_name
      ]);
      if (direct) return taxonSearchResult(direct, taxon, "Matched taxon name");

      const ancestors = await fetchTaxonAncestors(taxon);
      const ancestorMatch = matchTreeNodeByTaxonNames(ancestors.flatMap((ancestor) => [
        ancestor.name,
        ancestor.preferred_common_name
      ]));
      if (ancestorMatch) {
        return taxonSearchResult(ancestorMatch, taxon, `Closest tree match for ${taxon.name}`);
      }
    }

    return null;
  }

  async function fetchTaxonAncestors(taxon) {
    const ancestorIds = (taxon.ancestor_ids || [])
      .filter((id) => Number.isFinite(id) && id !== taxon.id)
      .slice(-12);
    if (!ancestorIds.length) return [];

    const response = await fetch(`https://api.inaturalist.org/v1/taxa/${ancestorIds.join(",")}`);
    if (!response.ok) return [];

    const data = await response.json();
    return (data.results || []).sort((a, b) =>
      (a.rank_level ?? 0) - (b.rank_level ?? 0)
    );
  }

  function matchTreeNodeByTaxonNames(names) {
    for (const name of names) {
      const key = normalizeSearch(name);
      if (!key) continue;
      const exact = preferredTreeMatch(state.taxonNameIndex.get(key));
      if (exact) return exact;
      const alias = preferredTreeMatch(state.taxonAliasIndex.get(key));
      if (alias) return alias;
    }
    return null;
  }

  function preferredTreeMatch(nodes = []) {
    return [...nodes].sort((a, b) => rankWeight(a.rank) - rankWeight(b.rank))[0] || null;
  }

  function taxonSearchResult(node, taxon, matchText) {
    return {
      node,
      score: 130,
      type: "taxon",
      matchText: `${matchText}: ${taxon.name}${taxon.rank ? ` (${taxon.rank})` : ""}`
    };
  }

  function includesPlantAncestor(taxon) {
    return (taxon.ancestor_ids || []).includes(47126);
  }

  function taxonQueryScore(taxon, query) {
    const name = normalizeSearch(taxon.name);
    const matched = normalizeSearch(taxon.matched_term);
    const common = normalizeSearch(taxon.preferred_common_name);
    let score = 0;
    if (name === query) score += 100;
    if (matched === query) score += 80;
    if (name.startsWith(query)) score += 40;
    if (common.includes(query)) score += 18;
    score += Math.min(20, Math.log10((taxon.observations_count || 0) + 1) * 4);
    return score;
  }

  function scoreNode(node, query) {
    const name = normalizeSearch(node.name);
    const rank = normalizeSearch(node.rank);
    const path = normalizeSearch(node.pathString || "");
    const id = normalizeSearch(node.id);
    const aliases = (node.searchAliases || []).map(normalizeSearch);

    if (name === query || aliases.includes(query)) return 120;
    if (name.startsWith(query) || aliases.some((alias) => alias.startsWith(query))) return 95;
    if (id === query) return 80;
    if (name.includes(query) || aliases.some((alias) => alias.includes(query))) return 65;
    if (rank.includes(query)) return 35;
    if (path.includes(query)) return 25;
    return 0;
  }

  function compareSearchResults(a, b) {
    return b.score - a.score || rankWeight(a.node.rank) - rankWeight(b.node.rank) || a.node.name.localeCompare(b.node.name);
  }

  window.AB.search = {
    init,
    closeSearch
  };
})();
