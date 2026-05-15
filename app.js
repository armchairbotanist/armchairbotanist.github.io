const MIN_ZOOM = 0.35;
const MAX_ZOOM = 1.8;
const ZOOM_STEP = 0.1;
const FIT_PADDING = 80;
const ORIENTATION_STORAGE_KEY = "plantTreeOrientationV2";

const ANATOMY_REFERENCES = {
  flower: {
    label: "Britannica: flower anatomy",
    url: "https://www.britannica.com/science/flower"
  },
  angiosperm: {
    label: "Britannica: angiosperm reproductive structures",
    url: "https://www.britannica.com/plant/angiosperm/Reproductive-structures"
  },
  monocot: {
    label: "UC Davis LibreTexts: monocots and eudicots",
    url: "https://bio.libretexts.org/Courses/University_of_California_Davis/PLS_002%3A_Botany_and_physiology_of_cultivated_plants/03%3A_Origin_and_evolution_of_land_plants/3.02%3A_Biodiversity_%28Organismal_Groups%29/3.2.04%3A_Angiosperm_Diversity/3.2.4.01%3A_Monocots_and_Eudicots"
  },
  orchid: {
    label: "Britannica: orchid morphology",
    url: "https://www.britannica.com/plant/orchid/Characteristic-morphological-features"
  }
};

const ANATOMY_NOTES = {
  angiosperms: [
    { text: "Flowers are reproductive shoots that may include sepals, petals, stamens, and pistils.", source: "flower" },
    { text: "Stamens produce pollen; pistils contain ovules and include ovary, style, and stigma.", source: "angiosperm" }
  ],
  monocots: [
    { text: "Monocots commonly have one cotyledon, parallel leaf venation, and floral parts in multiples of three.", source: "monocot" }
  ],
  eudicots: [
    { text: "Eudicots commonly show netted leaf venation and flower parts in fours or fives, unlike many monocots.", source: "monocot" }
  ],
  orchidaceae: [
    { text: "Orchid flowers often have a specialized petal called the lip, or labellum.", source: "orchid" },
    { text: "In orchids, fertile stamens are positioned on one side of the flower opposite the lip.", source: "orchid" }
  ],
  asteraceae: [
    { text: "Daisy-family heads are inflorescences of many small flowers; tubular florets can include united stamens and a pistil.", source: "angiosperm" }
  ],
  poaceae: [
    { text: "Grasses are monocots, so look for parallel leaf veins and reduced wind-pollinated flowers.", source: "monocot" }
  ],
  gymnosperms: [
    { text: "Gymnosperms produce seeds without flowers or enclosed fruits; cones are often the easiest reproductive structures to inspect.", source: "angiosperm" }
  ]
};

const state = {
  byId: new Map(),
  childrenByParent: new Map(),
  parentById: new Map(),
  searchIndex: [],
  wikiCache: new Map(),
  photoCache: new Map(),
  expanded: new Set(),
  activeId: null,
  rootId: null,
  orientation: "horizontal",
  zoom: 1
};

const els = {
  treeViewport: document.querySelector("#treeViewport"),
  treeSizer: document.querySelector("#treeSizer"),
  tree: document.querySelector("#tree"),
  zoomIn: document.querySelector("#zoomIn"),
  zoomOut: document.querySelector("#zoomOut"),
  zoomFit: document.querySelector("#zoomFit"),
  zoomReset: document.querySelector("#zoomReset"),
  zoomValue: document.querySelector("#zoomValue"),
  searchInput: document.querySelector("#searchInput"),
  clearSearch: document.querySelector("#clearSearch"),
  searchResults: document.querySelector("#searchResults"),
  settingsToggle: document.querySelector("#settingsToggle"),
  settingsPanel: document.querySelector("#settingsPanel"),
  orientationInputs: document.querySelectorAll("input[name='orientation']"),
  nodeTemplate: document.querySelector("#nodeTemplate"),
  detailsPanel: document.querySelector("#detailsPanel"),
  detailsContent: document.querySelector("#detailsContent"),
  closeDetails: document.querySelector("#closeDetails")
};

function init() {
  state.orientation = getSavedOrientation();
  syncOrientationControls();
  bindEvents();

  try {
    hydrateTree(window.PLANT_TREE_DATA);
    render();
  } catch (error) {
    console.error(error);
    renderLoadError(error);
  }
}

function bindEvents() {
  els.closeDetails.addEventListener("click", closeDetails);
  els.searchInput.addEventListener("input", renderSearchResults);
  els.searchInput.addEventListener("focus", renderSearchResults);
  els.clearSearch.addEventListener("click", () => {
    els.searchInput.value = "";
    closeSearch();
    els.searchInput.focus();
  });
  els.zoomIn.addEventListener("click", () => setZoom(state.zoom + ZOOM_STEP));
  els.zoomOut.addEventListener("click", () => setZoom(state.zoom - ZOOM_STEP));
  els.zoomFit.addEventListener("click", fitTreeToViewport);
  els.zoomReset.addEventListener("click", () => setZoom(1));
  els.settingsToggle.addEventListener("click", toggleSettings);
  for (const input of els.orientationInputs) {
    input.addEventListener("change", () => {
      if (!input.checked) return;
      setOrientation(input.value);
    });
  }

  els.treeViewport.addEventListener("wheel", (event) => {
    if (!event.ctrlKey && !event.metaKey) return;
    event.preventDefault();
    setZoom(state.zoom + (event.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP));
  }, { passive: false });

  window.addEventListener("resize", () => {
    syncZoomSize();
    drawEdges();
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".search-panel")) closeSearch();
    if (!event.target.closest(".settings")) closeSettings();
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
  els.tree.classList.toggle("is-horizontal", state.orientation === "horizontal");
  els.tree.classList.toggle("is-vertical", state.orientation === "vertical");
  els.tree.replaceChildren(root);
  applyZoom();
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
    openDetails(node.id);
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
  } else {
    state.expanded.add(nodeId);
  }
  render();
}

async function openDetails(nodeId) {
  const node = state.byId.get(nodeId);
  if (!node) return;
  els.detailsPanel.hidden = false;
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

function closeDetails() {
  els.detailsPanel.hidden = true;
  els.detailsContent.replaceChildren();
}

function renderDetails(node, wiki = null, photos = null) {
  const source = window.PLANT_TREE_DATA.sources[node.source];
  const children = getChildren(node.id);
  const wikiBlock = renderWikipediaBlock(wiki);
  const photoBlock = renderPhotoBlock(photos);
  const anatomyBlock = renderAnatomyBlock(node);
  const identificationBlock = renderIdentificationBlock(node, wiki);

  els.detailsContent.innerHTML = `
    <p class="details-kicker">Verifiable plant tree</p>
    <h2>${escapeHtml(node.name)}</h2>
    <dl class="details-list">
      <div><dt>Rank</dt><dd>${escapeHtml(capitalize(node.rank))}</dd></div>
      <div><dt>Children shown</dt><dd>${formatCount(children.length)}</dd></div>
      <div><dt>Node ID</dt><dd>${escapeHtml(node.id)}</dd></div>
      <div><dt>Tree path</dt><dd>${escapeHtml(node.pathString || node.name)}</dd></div>
      <div><dt>Source</dt><dd>${escapeHtml(source?.label || node.source)}</dd></div>
    </dl>
    ${photoBlock}
    ${anatomyBlock}
    ${wikiBlock}
    ${identificationBlock}
    <div class="details-copy">
      ${node.description ? `<p>${escapeHtml(node.description)}</p>` : ""}
      <p>${escapeHtml(source?.citation || "Source citation missing.")}</p>
    </div>
    <div class="details-links">
      ${source?.url ? `<a href="${escapeHtml(source.url)}" target="_blank" rel="noopener">Classification source</a>` : ""}
      ${wiki?.content_urls?.desktop?.page ? `<a href="${escapeHtml(wiki.content_urls.desktop.page)}" target="_blank" rel="noopener">Wikipedia</a>` : ""}
    </div>
  `;
}

function renderPhotoBlock(photos) {
  if (!photos) {
    return `
      <section class="details-section">
        <h3>Photos</h3>
        <p class="details-muted">Loading research-grade iNaturalist photos when available...</p>
      </section>
    `;
  }

  if (!photos.length) {
    return `
      <section class="details-section">
        <h3>Photos</h3>
        <p class="details-muted">No audited iNaturalist photo match is available for this node yet.</p>
      </section>
    `;
  }

  return `
    <section class="details-section">
      <h3>Photos</h3>
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

function renderAnatomyBlock(node) {
  const notes = anatomyNotesFor(node);
  if (!notes.length) return "";

  return `
    <section class="details-section">
      <h3>Anatomy Notes</h3>
      <ul class="trait-list">
        ${notes.map((note) => {
          const source = ANATOMY_REFERENCES[note.source];
          return `
            <li>
              ${escapeHtml(note.text)}
              ${source ? `<a class="inline-source" href="${escapeHtml(source.url)}" target="_blank" rel="noopener">${escapeHtml(source.label)}</a>` : ""}
            </li>
          `;
        }).join("")}
      </ul>
    </section>
  `;
}

function renderWikipediaBlock(wiki) {
  if (!wiki) {
    return `
      <section class="details-section">
        <h3>Overview</h3>
        <p class="details-muted">Loading Wikipedia overview when available...</p>
      </section>
    `;
  }

  const image = wiki.thumbnail?.source
    ? `<img class="details-image" src="${escapeHtml(wiki.thumbnail.source)}" alt="">`
    : "";
  const extract = wiki.extract
    ? `<p>${escapeHtml(limitSentences(wiki.extract, 4))}</p>`
    : `<p class="details-muted">No Wikipedia overview found for this node.</p>`;

  return `
    <section class="details-section">
      <h3>Overview</h3>
      <div class="details-copy">${extract}</div>
      ${image}
    </section>
  `;
}

function renderIdentificationBlock(node, wiki) {
  const text = `${wiki?.extract || ""} ${node.description || ""}`;
  const traits = inferIdentificationTraits(text);
  const traitItems = traits.length
    ? traits.map((trait) => `<li>${escapeHtml(trait)}</li>`).join("")
    : "<li>No reliable identification traits found in the current sources.</li>";

  return `
    <section class="details-section">
      <h3>Identification Notes</h3>
      <ul class="trait-list">${traitItems}</ul>
      <p class="details-muted">These notes are extracted from available prose and should be treated as clues, not a diagnostic key.</p>
    </section>
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

function fitTreeToViewport() {
  const bounds = measureTreeContent();
  if (!bounds.width || !bounds.height) return;

  const viewportWidth = Math.max(1, els.treeViewport.clientWidth - FIT_PADDING);
  const viewportHeight = Math.max(1, els.treeViewport.clientHeight - FIT_PADDING);
  const nextZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Math.min(
    viewportWidth / bounds.width,
    viewportHeight / bounds.height
  )));

  setZoom(nextZoom);
  requestAnimationFrame(() => {
    els.treeViewport.scrollTo({
      left: state.orientation === "vertical"
        ? Math.max(0, (els.treeSizer.offsetWidth - els.treeViewport.clientWidth) / 2)
        : 0,
      top: 0,
      behavior: "smooth"
    });
  });
}

function setOrientation(nextOrientation) {
  state.orientation = nextOrientation === "horizontal" ? "horizontal" : "vertical";
  try {
    localStorage.setItem(ORIENTATION_STORAGE_KEY, state.orientation);
  } catch {
    // Some privacy modes can block localStorage; orientation still works for the session.
  }
  syncOrientationControls();
  render();
}

function getSavedOrientation() {
  try {
    return localStorage.getItem(ORIENTATION_STORAGE_KEY) === "vertical" ? "vertical" : "horizontal";
  } catch {
    return "horizontal";
  }
}

function syncOrientationControls() {
  for (const input of els.orientationInputs) input.checked = input.value === state.orientation;
}

function toggleSettings() {
  const willOpen = els.settingsPanel.hidden;
  els.settingsPanel.hidden = !willOpen;
  els.settingsToggle.setAttribute("aria-expanded", String(willOpen));
}

function closeSettings() {
  els.settingsPanel.hidden = true;
  els.settingsToggle.setAttribute("aria-expanded", "false");
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

function setZoom(nextZoom) {
  state.zoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Number(nextZoom.toFixed(2))));
  applyZoom();
}

function applyZoom() {
  els.tree.style.setProperty("--zoom", state.zoom);
  els.zoomValue.textContent = `${Math.round(state.zoom * 100)}%`;
  els.zoomOut.disabled = state.zoom <= MIN_ZOOM;
  els.zoomIn.disabled = state.zoom >= MAX_ZOOM;
  requestAnimationFrame(() => {
    syncZoomSize();
    drawEdges();
  });
}

function syncZoomSize() {
  const bounds = measureTreeContent();
  els.treeSizer.style.width = `${bounds.width * state.zoom}px`;
  els.treeSizer.style.height = `${bounds.height * state.zoom}px`;
}

function measureTreeContent() {
  const root = els.tree.querySelector(".tree-root");
  if (!root) return { width: els.tree.scrollWidth, height: els.tree.scrollHeight };
  return {
    width: root.scrollWidth,
    height: root.scrollHeight
  };
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

    const parentPoint = state.orientation === "horizontal"
      ? rightCenter(parentNode, treeBox)
      : bottomCenter(parentNode, treeBox);
    for (const childNode of childNodes) {
      const childPoint = state.orientation === "horizontal"
        ? leftCenter(childNode, treeBox)
        : topCenter(childNode, treeBox);
      const distance = Math.max(54, state.orientation === "horizontal"
        ? childPoint.x - parentPoint.x
        : childPoint.y - parentPoint.y);
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      const curve = state.orientation === "horizontal"
        ? [
            `M ${parentPoint.x} ${parentPoint.y}`,
            `C ${parentPoint.x + distance * 0.58} ${parentPoint.y}`,
            `${childPoint.x - distance * 0.58} ${childPoint.y}`,
            `${childPoint.x} ${childPoint.y}`
          ]
        : [
            `M ${parentPoint.x} ${parentPoint.y}`,
            `C ${parentPoint.x} ${parentPoint.y + distance * 0.58}`,
            `${childPoint.x} ${childPoint.y - distance * 0.58}`,
            `${childPoint.x} ${childPoint.y}`
          ];
      path.setAttribute("d", curve.join(" "));
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
  const count = childCount ? `${formatCount(childCount)} shown` : "example";
  return `${capitalize(node.rank)} / ${count}`;
}

function nodeLabel(node, isExpanded) {
  const children = getChildren(node.id).length;
  if (!children) return `${node.name}, ${node.rank}, example node`;
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

function anatomyNotesFor(node) {
  const notes = [];
  const ids = new Set([node.id]);
  let currentId = node.id;
  while (state.parentById.has(currentId)) {
    currentId = state.parentById.get(currentId);
    ids.add(currentId);
  }

  if (ids.has("angiosperms")) notes.push(...(ANATOMY_NOTES.angiosperms || []));
  if (ids.has("monocots")) notes.push(...(ANATOMY_NOTES.monocots || []));
  if (ids.has("eudicots")) notes.push(...(ANATOMY_NOTES.eudicots || []));
  if (ids.has("gymnosperms")) notes.push(...(ANATOMY_NOTES.gymnosperms || []));
  notes.push(...(ANATOMY_NOTES[node.id] || []));

  return [...new Map(notes.map((note) => [note.text, note])).values()].slice(0, 6);
}

function inferIdentificationTraits(text) {
  const clean = String(text || "").replace(/\s+/g, " ").trim();
  if (!clean) return [];

  const keywords = [
    "flower", "flowers", "inflorescence", "petal", "petals", "sepal", "sepals",
    "leaf", "leaves", "stem", "stems", "bark", "fruit", "fruits", "seed", "seeds",
    "cone", "cones", "spore", "spores", "rhizome", "root", "roots", "habit",
    "tree", "shrub", "herb", "vine", "grass", "aquatic", "woody", "evergreen",
    "deciduous", "needle", "needles", "pollen"
  ];

  const sentences = clean.match(/[^.!?]+[.!?]+/g) || [clean];
  return sentences
    .map((sentence) => sentence.trim())
    .filter((sentence) => keywords.some((keyword) => sentence.toLowerCase().includes(keyword)))
    .slice(0, 5);
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

function bottomCenter(element, treeBox) {
  const box = element.getBoundingClientRect();
  return {
    x: (box.left + box.width / 2 - treeBox.left) / state.zoom,
    y: (box.bottom - treeBox.top) / state.zoom
  };
}

function topCenter(element, treeBox) {
  const box = element.getBoundingClientRect();
  return {
    x: (box.left + box.width / 2 - treeBox.left) / state.zoom,
    y: (box.top - treeBox.top) / state.zoom
  };
}

function rightCenter(element, treeBox) {
  const box = element.getBoundingClientRect();
  return {
    x: (box.right - treeBox.left) / state.zoom,
    y: (box.top + box.height / 2 - treeBox.top) / state.zoom
  };
}

function leftCenter(element, treeBox) {
  const box = element.getBoundingClientRect();
  return {
    x: (box.left - treeBox.left) / state.zoom,
    y: (box.top + box.height / 2 - treeBox.top) / state.zoom
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
