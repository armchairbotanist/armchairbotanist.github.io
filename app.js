const state = {
  byId: new Map(),
  childrenByParent: new Map(),
  parentById: new Map(),
  searchIndex: [],
  taxonNameIndex: new Map(),
  taxonAliasIndex: new Map(),
  taxonSearchCache: new Map(),
  searchLookupTimer: null,
  searchLookupSeq: 0,
  wikiCache: new Map(),
  photoCache: new Map(),
  expanded: new Set(),
  activeId: null,
  rootId: null
};

const els = {
  treeViewport: document.querySelector("#treeViewport"),
  tree: document.querySelector("#tree"),
  searchInput: document.querySelector("#searchInput"),
  clearSearch: document.querySelector("#clearSearch"),
  searchResults: document.querySelector("#searchResults"),
  nodeTemplate: document.querySelector("#nodeTemplate"),
  detailsContent: document.querySelector("#detailsContent"),
  siteFooter: document.querySelector("#siteFooter"),
  imageViewer: document.querySelector("#imageViewer"),
  imageViewerClose: document.querySelector("#imageViewerClose"),
  imageViewerImg: document.querySelector("#imageViewerImg"),
  imageViewerCaption: document.querySelector("#imageViewerCaption")
};

function init() {
  bindEvents();

  try {
    hydrateTree(window.PLANT_TREE_DATA);
    render();
    renderSiteFooter(window.PLANT_TREE_DATA);
    refreshDetails(state.rootId);
  } catch (error) {
    console.error(error);
    renderLoadError(error);
  }
}

function renderSiteFooter(data) {
  if (!els.siteFooter) return;
  const year = new Date().getFullYear();
  const version = data?.siteVersion || "1.00";
  els.siteFooter.textContent = `Copyright © ${year} Armchair Botanist · Version ${version}`;
}

function bindEvents() {
  els.searchInput.addEventListener("input", renderSearchResults);
  els.searchInput.addEventListener("focus", renderSearchResults);
  els.clearSearch.addEventListener("click", () => {
    els.searchInput.value = "";
    closeSearch();
    els.searchInput.focus();
  });

  window.addEventListener("resize", () => {
    drawEdges();
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".search-panel")) closeSearch();
  });

  els.imageViewerClose?.addEventListener("click", closeImageViewer);
  els.imageViewer?.addEventListener("click", (event) => {
    if (event.target === els.imageViewer) closeImageViewer();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !els.imageViewer?.hidden) closeImageViewer();
  });
}

function hydrateTree(data) {
  if (!data?.rootId || !Array.isArray(data.nodes)) {
    throw new Error("Plant tree data is missing or malformed.");
  }

  state.byId.clear();
  state.childrenByParent.clear();
  state.parentById.clear();
  state.searchIndex = [];
  state.taxonNameIndex.clear();
  state.taxonAliasIndex.clear();
  state.rootId = data.rootId;
  state.activeId = data.rootId;
  state.expanded = new Set([data.rootId]);

  for (const node of data.nodes) {
    state.byId.set(node.id, {
      ...node,
      children: node.children ? [...node.children] : []
    });
  }

  for (const node of state.byId.values()) {
    const children = node.children
      .map((childId, index) => {
        const child = state.byId.get(childId);
        if (child) child.treeSort = index;
        return child;
      })
      .filter(Boolean);
    state.childrenByParent.set(node.id, children);
    for (const child of children) state.parentById.set(child.id, node.id);
  }

  updatePaths(data.rootId, []);
  indexTaxonNames();
  state.searchIndex = Array.from(state.byId.values()).sort(compareNodes);
}

function updatePaths(nodeId, ancestors) {
  const node = state.byId.get(nodeId);
  if (!node) return;
  const nextAncestors = [...ancestors, node.name];
  node.pathString = nextAncestors.join(" / ");
  for (const child of getChildren(nodeId)) updatePaths(child.id, nextAncestors);
}

function indexTaxonNames() {
  state.taxonNameIndex.clear();
  state.taxonAliasIndex.clear();
  for (const node of state.byId.values()) {
    addIndexedTaxonName(state.taxonNameIndex, node.name, node);
    addIndexedTaxonName(state.taxonNameIndex, node.id, node);
    for (const alias of node.searchAliases || []) {
      addIndexedTaxonName(state.taxonAliasIndex, alias, node);
    }
  }
}

function addIndexedTaxonName(index, value, node) {
  const key = normalizeSearch(value);
  if (!key) return;
  if (!index.has(key)) index.set(key, []);
  index.get(key).push(node);
}

function render() {
  const rootNode = state.byId.get(state.rootId);
  if (!rootNode) return;

  const root = document.createElement("ul");
  root.className = "tree-root";
  root.setAttribute("role", "group");
  root.append(renderNode(rootNode, 1));
  els.tree.replaceChildren(root);
  requestAnimationFrame(drawEdges);
}

function renderNode(node, level) {
  const children = getChildren(node.id);
  const hasChildren = children.length > 0;
  const isExpanded = state.expanded.has(node.id);
  const item = els.nodeTemplate.content.firstElementChild.cloneNode(true);
  const nodeCard = item.querySelector(".node");
  const button = item.querySelector(".node-main");
  const infoButton = item.querySelector(".info-button");
  const name = item.querySelector(".node-name");
  const meta = item.querySelector(".node-meta");

  item.dataset.id = node.id;
  item.setAttribute("aria-level", String(level));
  item.setAttribute("aria-selected", String(state.activeId === node.id));
  if (hasChildren) item.setAttribute("aria-expanded", String(isExpanded));

  nodeCard.classList.toggle("is-active", state.activeId === node.id);
  nodeCard.classList.toggle("has-children", hasChildren);
  nodeCard.style.setProperty("--depth", level - 1);

  button.setAttribute("aria-label", nodeLabel(node, isExpanded));
  infoButton.setAttribute("aria-label", `Show details about ${node.name}`);

  name.textContent = node.name;
  meta.textContent = nodeMeta(node, children.length);

  button.addEventListener("click", () => handleNodeClick(node.id));
  infoButton.addEventListener("click", () => {
    state.activeId = node.id;
    render();
    refreshDetails(node.id);
  });

  if (hasChildren && isExpanded) {
    const branch = document.createElement("ul");
    branch.className = "branch";
    branch.setAttribute("role", "group");
    for (const child of children) branch.append(renderNode(child, level + 1));
    item.append(branch);
  }

  return item;
}

function handleNodeClick(nodeId) {
  const node = state.byId.get(nodeId);
  if (!node) return;

  state.activeId = nodeId;
  if (!getChildren(nodeId).length) {
    render();
    return;
  }

  if (state.expanded.has(nodeId)) {
    state.expanded.delete(nodeId);
    render();
  } else {
    state.expanded.add(nodeId);
    render();
    scrollExpandedChildrenIntoView(nodeId);
  }
}

function scrollExpandedChildrenIntoView(nodeId) {
  requestAnimationFrame(() => {
    const item = els.tree.querySelector(`[data-id="${CSS.escape(nodeId)}"]`);
    const branch = item?.querySelector(":scope > .branch");
    const target = branch || item;
    if (!target) return;

    const viewportBox = els.treeViewport.getBoundingClientRect();
    const targetBox = target.getBoundingClientRect();
    const targetCenterX = targetBox.left + targetBox.width / 2;
    const targetCenterY = targetBox.top + targetBox.height / 2;
    const viewportCenterX = viewportBox.left + viewportBox.width * 0.54;
    const viewportCenterY = viewportBox.top + viewportBox.height * 0.48;

    els.treeViewport.scrollTo({
      left: els.treeViewport.scrollLeft + targetCenterX - viewportCenterX,
      top: els.treeViewport.scrollTop + targetCenterY - viewportCenterY,
      behavior: "smooth"
    });
  });
}

async function refreshDetails(nodeId) {
  const node = state.byId.get(nodeId);
  if (!node) return;
  renderDetails(node);

  try {
    const [wiki, photos] = await Promise.all([
      fetchWikipediaDetails(node),
      fetchINaturalistPhotos(node)
    ]);
    if (state.activeId === nodeId) renderDetails(node, wiki, photos);
  } catch (error) {
    console.warn("Details enrichment unavailable", error);
  }
}

function renderDetails(node, wiki = null, photos = null) {
  const source = window.PLANT_TREE_DATA.sources[node.source];
  const overviewBlock = renderOverviewBlock(node, wiki);
  const photoBlock = renderPhotoBlock(photos);
  const factsBlock = renderFactsBlock(node);
  const figureBlock = renderFigureBlock(node);
  const sourceBlock = renderSourceBlock(node, source, wiki);

  els.detailsContent.innerHTML = `
    <h2>${escapeHtml(node.name)}</h2>
    <p class="details-rank">${escapeHtml(capitalize(node.rank))}</p>
    <p class="details-path">${escapeHtml(node.pathString || node.name)}</p>
    ${overviewBlock}
    ${factsBlock}
    ${figureBlock}
    ${photoBlock}
    ${sourceBlock}
  `;
  bindFigureViewer();
}

function renderFactsBlock(node) {
  const facts = (node.facts || []).slice(0, 5);
  if (!facts.length) return "";

  return `
    <section class="details-section facts-section">
      <ul class="trait-list">
        ${facts.map((fact) => {
          const source = window.PLANT_TREE_DATA.sources[fact.source];
          return `
            <li>
              ${escapeHtml(fact.text)}
              ${renderInlineSource(source)}
            </li>
          `;
        }).join("")}
      </ul>
    </section>
  `;
}

function renderFigureBlock(node) {
  const figures = node.figures || [];
  if (!figures.length) return "";

  return `
    <section class="details-section figure-section">
      ${figures.map((figure) => {
        const source = window.PLANT_TREE_DATA.sources[figure.source];
        return `
          <figure class="source-figure">
            <button class="figure-image-button" type="button" aria-label="Open larger image: ${escapeHtml(figure.caption || node.name)}">
              <img src="${escapeHtml(figure.image)}" alt="${escapeHtml(figure.alt || figure.caption || node.name)}" loading="lazy">
            </button>
            <figcaption>
              <strong>${escapeHtml(figure.caption || "")}</strong>
              ${renderInlineSource(source)}
              ${figure.panels?.length ? `
                <ul>
                  ${figure.panels.map((panel) => `<li>${escapeHtml(panel)}</li>`).join("")}
                </ul>
              ` : ""}
            </figcaption>
          </figure>
        `;
      }).join("")}
    </section>
  `;
}

function bindFigureViewer() {
  els.detailsContent.querySelectorAll(".figure-image-button").forEach((button) => {
    button.addEventListener("click", () => {
      const image = button.querySelector("img");
      const figure = button.closest(".source-figure");
      const caption = figure?.querySelector("figcaption")?.textContent?.replace(/\s+/g, " ").trim() || "";
      openImageViewer(image?.getAttribute("src"), image?.getAttribute("alt"), caption);
    });
  });
}

function openImageViewer(src, alt, caption) {
  if (!src || !els.imageViewer || !els.imageViewerImg || !els.imageViewerCaption) return;
  els.imageViewerImg.src = src;
  els.imageViewerImg.alt = alt || caption || "Expanded image";
  els.imageViewerCaption.textContent = caption || "";
  els.imageViewer.hidden = false;
  document.body.classList.add("has-image-viewer");
  els.imageViewerClose?.focus({ preventScroll: true });
}

function closeImageViewer() {
  if (!els.imageViewer || els.imageViewer.hidden) return;
  els.imageViewer.hidden = true;
  document.body.classList.remove("has-image-viewer");
  if (els.imageViewerImg) {
    els.imageViewerImg.removeAttribute("src");
    els.imageViewerImg.alt = "";
  }
  if (els.imageViewerCaption) els.imageViewerCaption.textContent = "";
}

function renderInlineSource(source) {
  if (!source) return "";
  if (source.url) {
    return `<a class="inline-source" href="${escapeHtml(source.url)}" target="_blank" rel="noopener">${escapeHtml(source.label)}</a>`;
  }
  return `<span class="inline-source">${escapeHtml(source.label)}</span>`;
}

function renderPhotoBlock(photos) {
  if (!photos) {
    return `
      <section class="details-section photo-section">
        <p class="details-muted">Loading research-grade iNaturalist photos when available...</p>
      </section>
    `;
  }

  if (!photos.length) {
    return "";
  }

  return `
    <section class="details-section photo-section">
      <div class="photo-grid">
        ${photos.map((photo) => `
          <a href="${escapeHtml(photo.observationUrl)}" target="_blank" rel="noopener" title="${escapeHtml(photo.attribution)}">
            <img src="${escapeHtml(photo.url)}" alt="${escapeHtml(photo.alt)}" loading="lazy">
          </a>
        `).join("")}
      </div>
      <p class="details-muted">Photos are from iNaturalist research-grade observations when available. Open a photo for observation and attribution details.</p>
    </section>
  `;
}

function renderOverviewBlock(node, wiki) {
  const paragraphs = [];
  if (node.description) paragraphs.push(node.description);
  if (wiki?.extract) paragraphs.push(limitSentences(wiki.extract, 4));

  if (!paragraphs.length) {
    return `<p class="details-muted">Loading overview when available...</p>`;
  }

  return `
    <div class="details-copy overview-copy">
      ${paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
    </div>
  `;
}

function renderSourceBlock(node, source, wiki) {
  return `
    <footer class="details-sources">
      <p>${escapeHtml(source?.citation || "Source citation missing.")}</p>
      <div class="details-links">
        ${source?.url ? `<a href="${escapeHtml(source.url)}" target="_blank" rel="noopener">Source reference</a>` : ""}
        ${wiki?.content_urls?.desktop?.page ? `<a href="${escapeHtml(wiki.content_urls.desktop.page)}" target="_blank" rel="noopener">Wikipedia</a>` : ""}
      </div>
    </footer>
  `;
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
    revealNode(node.id);
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

function revealNode(nodeId) {
  let currentId = nodeId;
  while (state.parentById.has(currentId)) {
    const parentId = state.parentById.get(currentId);
    state.expanded.add(parentId);
    currentId = parentId;
  }

  if (getChildren(nodeId).length) state.expanded.add(nodeId);
  state.activeId = nodeId;
  render();

  requestAnimationFrame(() => {
    const active = els.tree.querySelector(`[data-id="${CSS.escape(nodeId)}"] .node-main`);
    active?.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
    active?.focus({ preventScroll: true });
  });
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

async function fetchWikipediaDetails(node) {
  if (state.wikiCache.has(node.name)) return state.wikiCache.get(node.name);

  const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(node.name)}`);
  if (!response.ok) {
    state.wikiCache.set(node.name, null);
    return null;
  }

  const data = await response.json();
  state.wikiCache.set(node.name, data);
  return data;
}

async function fetchINaturalistPhotos(node) {
  const photoQuery = photoTaxonFor(node);
  if (!photoQuery) return [];
  if (state.photoCache.has(photoQuery)) return state.photoCache.get(photoQuery);

  const taxonId = await resolveINaturalistTaxonId(photoQuery);
  if (!taxonId) {
    state.photoCache.set(photoQuery, []);
    return [];
  }

  const params = new URLSearchParams({
    taxon_id: String(taxonId),
    photos: "true",
    quality_grade: "research",
    verifiable: "true",
    per_page: "6",
    order_by: "votes"
  });
  const response = await fetch(`https://api.inaturalist.org/v1/observations?${params.toString()}`);
  if (!response.ok) {
    state.photoCache.set(photoQuery, []);
    return [];
  }

  const data = await response.json();
  const photos = (data.results || [])
    .flatMap((observation) => (observation.photos || []).slice(0, 1).map((photo) => ({
      url: photo.url?.replace("square", "medium"),
      observationUrl: observation.uri || `https://www.inaturalist.org/observations/${observation.id}`,
      alt: observation.taxon?.preferred_common_name || observation.taxon?.name || node.name,
      attribution: [photo.attribution, photo.license_code].filter(Boolean).join(" / ")
    })))
    .filter((photo) => photo.url)
    .slice(0, 6);

  state.photoCache.set(photoQuery, photos);
  return photos;
}

async function resolveINaturalistTaxonId(query) {
  const params = new URLSearchParams({
    q: query,
    is_active: "true",
    per_page: "8"
  });
  const response = await fetch(`https://api.inaturalist.org/v1/taxa/autocomplete?${params.toString()}`);
  if (!response.ok) return null;

  const data = await response.json();
  const exact = (data.results || []).find((taxon) =>
    taxon.name?.toLowerCase() === query.toLowerCase()
  );
  return exact?.id || null;
}

function photoTaxonFor(node) {
  if (node.photoTaxon) return node.photoTaxon;
  if (node.rank === "order" || node.rank === "family" || node.rank === "genus") return node.name;
  return null;
}

function drawEdges() {
  els.tree.querySelector(".tree-edges")?.remove();

  const treeBox = els.tree.getBoundingClientRect();
  const width = els.tree.scrollWidth;
  const height = els.tree.scrollHeight;
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.classList.add("tree-edges");
  svg.setAttribute("width", String(width));
  svg.setAttribute("height", String(height));
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("aria-hidden", "true");

  const expandedParents = els.tree.querySelectorAll(".tree-item[aria-expanded='true']");
  for (const parentItem of expandedParents) {
    const parentNode = parentItem.querySelector(":scope > .node");
    const childNodes = parentItem.querySelectorAll(":scope > .branch > .tree-item > .node");
    if (!parentNode || !childNodes.length) continue;

    const parentPoint = rightCenter(parentNode, treeBox);
    for (const childNode of childNodes) {
      const childPoint = leftCenter(childNode, treeBox);
      const distance = Math.max(54, childPoint.x - parentPoint.x);
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", [
        `M ${parentPoint.x} ${parentPoint.y}`,
        `C ${parentPoint.x + distance * 0.58} ${parentPoint.y}`,
        `${childPoint.x - distance * 0.58} ${childPoint.y}`,
        `${childPoint.x} ${childPoint.y}`
      ].join(" "));
      svg.append(path);
    }
  }

  els.tree.prepend(svg);
}

function renderLoadError(error) {
  els.tree.innerHTML = `
    <div class="load-error">
      <strong>Could not load plant tree data.</strong>
      <span>${escapeHtml(error.message || "Check plant-tree-data.js.")}</span>
    </div>
  `;
}

function getChildren(nodeId) {
  return state.childrenByParent.get(nodeId) || [];
}

function nodeMeta(node, childCount) {
  if (childCount) return `${capitalize(node.rank)} / ${formatCount(childCount)} shown`;
  if (node.rank === "genus") return "Genus / example";
  return capitalize(node.rank);
}

function nodeLabel(node, isExpanded) {
  const children = getChildren(node.id).length;
  if (!children) return `${node.name}, ${node.rank}`;
  return `${node.name}, ${node.rank}, ${children} children, ${isExpanded ? "expanded" : "collapsed"}`;
}

function scoreNode(node, query) {
  const name = normalizeSearch(node.name);
  const rank = normalizeSearch(node.rank);
  const path = normalizeSearch(node.pathString || "");
  const id = normalizeSearch(node.id);

  if (name === query) return 120;
  if (name.startsWith(query)) return 95;
  if (id === query) return 80;
  if (name.includes(query)) return 65;
  if (rank.includes(query)) return 35;
  if (path.includes(query)) return 25;
  return 0;
}

function compareSearchResults(a, b) {
  return b.score - a.score || rankWeight(a.node.rank) - rankWeight(b.node.rank) || a.node.name.localeCompare(b.node.name);
}

function normalizeSearch(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function limitSentences(text, limit) {
  const sentences = String(text || "").match(/[^.!?]+[.!?]+/g);
  if (!sentences) return String(text || "");
  return sentences.slice(0, limit).join(" ").trim();
}

function compareNodes(a, b) {
  if (Number.isFinite(a.treeSort) || Number.isFinite(b.treeSort)) {
    return (a.treeSort ?? 9999) - (b.treeSort ?? 9999);
  }
  return rankWeight(a.rank) - rankWeight(b.rank) || a.name.localeCompare(b.name);
}

function rankWeight(rank) {
  const weights = {
    clade: 1,
    grade: 2,
    order: 3,
    family: 4,
    genus: 5
  };
  return weights[rank] || 50;
}

function rightCenter(element, treeBox) {
  const box = element.getBoundingClientRect();
  return {
    x: box.right - treeBox.left,
    y: box.top + box.height / 2 - treeBox.top
  };
}

function leftCenter(element, treeBox) {
  const box = element.getBoundingClientRect();
  return {
    x: box.left - treeBox.left,
    y: box.top + box.height / 2 - treeBox.top
  };
}

function formatCount(value) {
  return Number(value || 0).toLocaleString();
}

function capitalize(value) {
  const clean = String(value || "");
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

init();
