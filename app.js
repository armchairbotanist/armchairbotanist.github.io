const state = {
  byId: new Map(),
  childrenByParent: new Map(),
  parentById: new Map(),
  searchIndex: [],
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
  detailsContent: document.querySelector("#detailsContent")
};

function init() {
  bindEvents();

  try {
    hydrateTree(window.PLANT_TREE_DATA);
    render();
    refreshDetails(state.rootId);
  } catch (error) {
    console.error(error);
    renderLoadError(error);
  }
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
}

function hydrateTree(data) {
  if (!data?.rootId || !Array.isArray(data.nodes)) {
    throw new Error("Plant tree data is missing or malformed.");
  }

  state.byId.clear();
  state.childrenByParent.clear();
  state.parentById.clear();
  state.searchIndex = [];
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
  state.searchIndex = Array.from(state.byId.values()).sort(compareNodes);
}

function updatePaths(nodeId, ancestors) {
  const node = state.byId.get(nodeId);
  if (!node) return;
  const nextAncestors = [...ancestors, node.name];
  node.pathString = nextAncestors.join(" / ");
  for (const child of getChildren(nodeId)) updatePaths(child.id, nextAncestors);
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
  const sourceBlock = renderSourceBlock(node, source, wiki);

  els.detailsContent.innerHTML = `
    <h2>${escapeHtml(node.name)}</h2>
    <p class="details-rank">${escapeHtml(capitalize(node.rank))}</p>
    <p class="details-path">${escapeHtml(node.pathString || node.name)}</p>
    ${overviewBlock}
    ${factsBlock}
    ${photoBlock}
    ${sourceBlock}
  `;
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
              ${source ? `<a class="inline-source" href="${escapeHtml(source.url)}" target="_blank" rel="noopener">${escapeHtml(source.label)}</a>` : ""}
            </li>
          `;
        }).join("")}
      </ul>
    </section>
  `;
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
  if (wiki?.extract) paragraphs.push(limitSentences(wiki.extract, 4));
  if (node.description) paragraphs.push(node.description);

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
  const query = els.searchInput.value.trim().toLowerCase();
  if (!query) {
    closeSearch();
    return;
  }

  const results = state.searchIndex
    .map((node) => ({ node, score: scoreNode(node, query) }))
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score || a.node.name.localeCompare(b.node.name))
    .slice(0, 12);

  if (!results.length) {
    const empty = document.createElement("p");
    empty.className = "search-empty";
    empty.textContent = "No matches in the current curated tree yet.";
    els.searchResults.replaceChildren(empty);
    els.searchResults.classList.add("is-open");
    return;
  }

  els.searchResults.replaceChildren(...results.map(({ node }) => {
    const button = document.createElement("button");
    button.className = "search-result";
    button.type = "button";
    button.innerHTML = `
      <strong>${escapeHtml(node.name)}</strong>
      <span>${escapeHtml(capitalize(node.rank))} / ${escapeHtml(node.pathString || "Plant tree")}</span>
    `;
    button.addEventListener("click", () => {
      els.searchInput.value = "";
      closeSearch();
      revealNode(node.id);
    });
    return button;
  }));
  els.searchResults.classList.add("is-open");
}

function closeSearch() {
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
  const name = node.name.toLowerCase();
  const rank = node.rank.toLowerCase();
  const path = (node.pathString || "").toLowerCase();
  const id = node.id.toLowerCase();

  if (name === query) return 120;
  if (name.startsWith(query)) return 95;
  if (id === query) return 80;
  if (name.includes(query)) return 65;
  if (rank.includes(query)) return 35;
  if (path.includes(query)) return 25;
  return 0;
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
