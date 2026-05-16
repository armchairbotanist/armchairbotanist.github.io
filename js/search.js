(function () {
  /**
   * Owns the search box, local tree search, and optional iNaturalist-backed
   * matching that can map genus/species names back to a tree family/order.
   */
  class SearchController {
    /**
     * Stores shared app state, DOM handles, and search-related constants.
     */
    constructor(app) {
      this.config = app.config.search;
      this.state = app.state;
      this.els = app.els;
      this.utils = app.utils;
    }

    /**
     * Registers input, focus, clear, and outside-click search interactions.
     */
    init() {
      this.els.searchInput.addEventListener("input", () => this.renderSearchResults());
      this.els.searchInput.addEventListener("focus", () => this.renderSearchResults());
      this.els.clearSearch.addEventListener("click", () => {
        this.els.searchInput.value = "";
        this.closeSearch();
        this.els.searchInput.focus();
      });

      document.addEventListener("click", (event) => {
        if (!event.target.closest(".search-panel")) this.closeSearch();
      });
    }

    /**
     * Reads the current search text, renders immediate local results,
     * and schedules a broader taxon lookup when useful.
     */
    renderSearchResults() {
      const queryText = this.els.searchInput.value.trim();
      const query = this.utils.normalizeSearch(queryText);
      if (!query) {
        this.closeSearch();
        return;
      }

      const localResults = this.localSearch(query);
      this.renderSearchList(localResults, {
        pending: query.length >= this.config.minTaxonQueryLength,
        emptyText: "No local match yet."
      });

      this.queueTaxonLookup(queryText);
    }

    /**
     * Scores every local tree node against a normalized query and returns the best matches.
     */
    localSearch(query) {
      return this.state.searchIndex
        .map((node) => ({ node, score: this.scoreNode(node, query), type: "local" }))
        .filter((result) => result.score > 0)
        .sort((a, b) => this.compareSearchResults(a, b))
        .slice(0, this.config.maxResults);
    }

    /**
     * Writes search result buttons, empty messages, or pending lookup messages.
     */
    renderSearchList(results, options = {}) {
      const { pending = false, emptyText = "No matches found." } = options;

      if (!results.length && !pending) {
        const empty = document.createElement("p");
        empty.className = "search-empty";
        empty.textContent = emptyText;
        this.els.searchResults.replaceChildren(empty);
        this.els.searchResults.classList.add("is-open");
        return;
      }

      const items = results.map((result) => this.renderSearchResult(result));
      if (pending) {
        const pendingMessage = document.createElement("p");
        pendingMessage.className = "search-empty";
        pendingMessage.textContent = results.length ? "Checking broader taxon names..." : "Checking taxon names...";
        items.push(pendingMessage);
      }
      this.els.searchResults.replaceChildren(...items);
      this.els.searchResults.classList.add("is-open");
    }

    /**
     * Builds one clickable search result that reveals the matching tree node.
     */
    renderSearchResult(result) {
      const { node } = result;
      const button = document.createElement("button");
      button.className = "search-result";
      button.type = "button";
      const matchText = result.matchText ? `<span class="search-match">${this.utils.escapeHtml(result.matchText)}</span>` : "";
      button.innerHTML = `
        <strong>${this.utils.escapeHtml(node.name)}</strong>
        <span>${this.utils.escapeHtml(this.utils.capitalize(node.rank))} / ${this.utils.escapeHtml(node.pathString || "Plant tree")}</span>
        ${matchText}
      `;
      button.addEventListener("click", () => {
        this.els.searchInput.value = "";
        this.closeSearch();
        window.AB.tree.revealNode(node.id, { highlight: true });
      });
      return button;
    }

    /**
     * Debounces the remote taxon lookup and ignores stale responses.
     */
    queueTaxonLookup(queryText) {
      window.clearTimeout(this.state.searchLookupTimer);
      this.state.searchLookupSeq += 1;

      if (this.utils.normalizeSearch(queryText).length < this.config.minTaxonQueryLength) return;

      const lookupSeq = this.state.searchLookupSeq;
      this.state.searchLookupTimer = window.setTimeout(async () => {
        const currentQueryText = this.els.searchInput.value.trim();
        const currentQuery = this.utils.normalizeSearch(currentQueryText);
        if (!currentQuery || currentQuery !== this.utils.normalizeSearch(queryText)) return;

        try {
          const taxonResult = await this.resolveTaxonSearch(currentQueryText);
          if (lookupSeq !== this.state.searchLookupSeq || this.utils.normalizeSearch(this.els.searchInput.value) !== currentQuery) return;
          const results = this.mergeSearchResults(this.localSearch(currentQuery), taxonResult ? [taxonResult] : []);
          this.renderSearchList(results, {
            pending: false,
            emptyText: "No matching family or order found."
          });
        } catch (error) {
          console.warn("Taxon search unavailable", error);
          if (lookupSeq !== this.state.searchLookupSeq) return;
          this.renderSearchList(this.localSearch(currentQuery), {
            pending: false,
            emptyText: "No matching family or order found."
          });
        }
      }, this.config.debounceMs);
    }

    /**
     * Combines external taxon matches with local matches without duplicate nodes.
     */
    mergeSearchResults(localResults, taxonResults) {
      const merged = [];
      const seen = new Set();
      for (const result of [...taxonResults, ...localResults]) {
        if (!result?.node || seen.has(result.node.id)) continue;
        seen.add(result.node.id);
        merged.push(result);
      }
      return merged.sort((a, b) => this.compareSearchResults(a, b)).slice(0, this.config.maxResults);
    }

    /**
     * Closes the result menu and cancels pending remote lookup work.
     */
    closeSearch() {
      window.clearTimeout(this.state.searchLookupTimer);
      this.state.searchLookupSeq += 1;
      this.els.searchResults.classList.remove("is-open");
      this.els.searchResults.replaceChildren();
    }

    /**
     * Uses iNaturalist autocomplete to resolve user text to a tree node or ancestor.
     */
    async resolveTaxonSearch(queryText) {
      const query = this.utils.normalizeSearch(queryText);
      if (this.state.taxonSearchCache.has(query)) return this.state.taxonSearchCache.get(query);

      const params = new URLSearchParams({
        q: queryText,
        is_active: "true",
        per_page: String(this.config.taxonAutocompleteLimit)
      });
      const response = await fetch(`https://api.inaturalist.org/v1/taxa/autocomplete?${params.toString()}`);
      if (!response.ok) {
        this.state.taxonSearchCache.set(query, null);
        return null;
      }

      const data = await response.json();
      const result = await this.bestTreeMatchForTaxa(query, data.results || []);
      this.state.taxonSearchCache.set(query, result);
      return result;
    }

    /**
     * Chooses the best plant taxon result and maps it to either a direct tree node
     * or the closest tree ancestor found through iNaturalist taxonomy.
     */
    async bestTreeMatchForTaxa(query, taxa) {
      const sortedTaxa = [...taxa]
        .filter((taxon) => taxon.iconic_taxon_name === "Plantae" || this.includesPlantAncestor(taxon))
        .sort((a, b) => this.taxonQueryScore(b, query) - this.taxonQueryScore(a, query));

      for (const taxon of sortedTaxa) {
        const direct = this.matchTreeNodeByTaxonNames([
          taxon.name,
          taxon.matched_term,
          taxon.preferred_common_name
        ]);
        if (direct) return this.taxonSearchResult(direct, taxon, "Matched taxon name");

        const ancestors = await this.fetchTaxonAncestors(taxon);
        const ancestorMatch = this.matchTreeNodeByTaxonNames(ancestors.flatMap((ancestor) => [
          ancestor.name,
          ancestor.preferred_common_name
        ]));
        if (ancestorMatch) {
          return this.taxonSearchResult(ancestorMatch, taxon, `Closest tree match for ${taxon.name}`);
        }
      }

      return null;
    }

    /**
     * Fetches the recent ancestor chain for an iNaturalist taxon.
     */
    async fetchTaxonAncestors(taxon) {
      const ancestorIds = (taxon.ancestor_ids || [])
        .filter((id) => Number.isFinite(id) && id !== taxon.id)
        .slice(-this.config.ancestorLimit);
      if (!ancestorIds.length) return [];

      const response = await fetch(`https://api.inaturalist.org/v1/taxa/${ancestorIds.join(",")}`);
      if (!response.ok) return [];

      const data = await response.json();
      return (data.results || []).sort((a, b) =>
        (a.rank_level ?? 0) - (b.rank_level ?? 0)
      );
    }

    /**
     * Finds the preferred tree node for a list of scientific/common names.
     */
    matchTreeNodeByTaxonNames(names) {
      for (const name of names) {
        const key = this.utils.normalizeSearch(name);
        if (!key) continue;
        const exact = this.preferredTreeMatch(this.state.taxonNameIndex.get(key));
        if (exact) return exact;
        const alias = this.preferredTreeMatch(this.state.taxonAliasIndex.get(key));
        if (alias) return alias;
      }
      return null;
    }

    /**
     * Selects the broadest/highest-ranked node from a set of exact name matches.
     */
    preferredTreeMatch(nodes = []) {
      return [...nodes].sort((a, b) => this.utils.rankWeight(a.rank) - this.utils.rankWeight(b.rank))[0] || null;
    }

    /**
     * Wraps a taxon-derived tree match in the same result shape used by local search.
     */
    taxonSearchResult(node, taxon, matchText) {
      return {
        node,
        score: 130,
        type: "taxon",
        matchText: `${matchText}: ${taxon.name}${taxon.rank ? ` (${taxon.rank})` : ""}`
      };
    }

    /**
     * Checks whether an iNaturalist autocomplete result belongs under Plantae.
     */
    includesPlantAncestor(taxon) {
      return (taxon.ancestor_ids || []).includes(this.config.plantAncestorTaxonId);
    }

    /**
     * Scores iNaturalist taxa so exact scientific-name matches beat looser/common-name matches.
     */
    taxonQueryScore(taxon, query) {
      const name = this.utils.normalizeSearch(taxon.name);
      const matched = this.utils.normalizeSearch(taxon.matched_term);
      const common = this.utils.normalizeSearch(taxon.preferred_common_name);
      let score = 0;
      if (name === query) score += 100;
      if (matched === query) score += 80;
      if (name.startsWith(query)) score += 40;
      if (common.includes(query)) score += 18;
      score += Math.min(20, Math.log10((taxon.observations_count || 0) + 1) * 4);
      return score;
    }

    /**
     * Scores one local tree node against the normalized query.
     */
    scoreNode(node, query) {
      const name = this.utils.normalizeSearch(node.name);
      const rank = this.utils.normalizeSearch(node.rank);
      const path = this.utils.normalizeSearch(node.pathString || "");
      const id = this.utils.normalizeSearch(node.id);
      const aliases = (node.searchAliases || []).map((alias) => this.utils.normalizeSearch(alias));

      if (name === query || aliases.includes(query)) return 120;
      if (name.startsWith(query) || aliases.some((alias) => alias.startsWith(query))) return 95;
      if (id === query) return 80;
      if (name.includes(query) || aliases.some((alias) => alias.includes(query))) return 65;
      if (rank.includes(query)) return 35;
      if (path.includes(query)) return 25;
      return 0;
    }

    /**
     * Orders search results by score, then rank, then display name.
     */
    compareSearchResults(a, b) {
      return b.score - a.score ||
        this.utils.rankWeight(a.node.rank) - this.utils.rankWeight(b.node.rank) ||
        a.node.name.localeCompare(b.node.name);
    }
  }

  window.AB.SearchController = SearchController;
  window.AB.search = new SearchController(window.AB);
})();
