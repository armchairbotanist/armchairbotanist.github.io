(function () {
  const { state, els, utils } = window.AB;
  const { escapeHtml, capitalize, limitSentences } = utils;
  const desktopResizeQuery = window.matchMedia("(min-width: 761px)");
  let resizeDrag = null;
  let resizeFrame = null;

  function init() {
    setupDetailsResize();
    els.imageViewerClose?.addEventListener("click", closeImageViewer);
    els.imageViewer?.addEventListener("click", (event) => {
      if (event.target === els.imageViewer) closeImageViewer();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !els.imageViewer?.hidden) closeImageViewer();
    });
  }

  function setupDetailsResize() {
    if (!els.appShell || !els.detailsPanel || !els.detailsResizeHandle) return;

    applyStoredDetailsSize();
    els.detailsResizeHandle.addEventListener("pointerdown", startDetailsResize);
    els.detailsResizeHandle.addEventListener("keydown", handleResizeKeydown);
    window.addEventListener("resize", clampActiveDetailsSize);

    if (desktopResizeQuery.addEventListener) {
      desktopResizeQuery.addEventListener("change", applyStoredDetailsSize);
    } else {
      desktopResizeQuery.addListener(applyStoredDetailsSize);
    }
  }

  function activeResizeMode() {
    return desktopResizeQuery.matches ? "desktop" : "mobile";
  }

  function storageKey(mode) {
    const version = window.PLANT_TREE_DATA?.siteVersion || "1.01";
    return `armchair-botanist:${version}:details-pane:${mode}`;
  }

  function readStoredSize(mode) {
    try {
      const value = Number.parseFloat(window.localStorage.getItem(storageKey(mode)));
      return Number.isFinite(value) ? value : null;
    } catch (_error) {
      return null;
    }
  }

  function writeStoredSize(mode, value) {
    try {
      window.localStorage.setItem(storageKey(mode), String(Math.round(value)));
    } catch (_error) {
      // Private browsing can disable storage; resizing should still work for the session.
    }
  }

  function applyStoredDetailsSize() {
    const mode = activeResizeMode();
    const stored = readStoredSize(mode);
    setDetailsSize(mode, stored || getCurrentPaneSize(mode), false);
  }

  function clampActiveDetailsSize() {
    const mode = activeResizeMode();
    setDetailsSize(mode, getCurrentPaneSize(mode), false);
  }

  function getCurrentPaneSize(mode) {
    const box = els.detailsPanel.getBoundingClientRect();
    return mode === "desktop" ? box.width : box.height;
  }

  function getPaneLimits(mode) {
    const shellBox = els.appShell.getBoundingClientRect();

    if (mode === "desktop") {
      const min = Math.min(340, Math.max(300, shellBox.width - 280));
      const max = Math.max(min, Math.min(760, shellBox.width - 260));
      return { min: Math.round(min), max: Math.round(max) };
    }

    const min = Math.max(210, Math.min(300, shellBox.height * 0.32));
    const max = Math.max(min, Math.min(shellBox.height - 130, shellBox.height * 0.72));
    return { min: Math.round(min), max: Math.round(max) };
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function setDetailsSize(mode, value, persist) {
    const limits = getPaneLimits(mode);
    const next = Math.round(clamp(value, limits.min, limits.max));
    const property = mode === "desktop" ? "--details-pane-width" : "--details-pane-height";
    document.documentElement.style.setProperty(property, `${next}px`);
    syncResizeHandle(mode, next, limits);
    if (persist) writeStoredSize(mode, next);
    scheduleTreeRefresh();
    return next;
  }

  function syncResizeHandle(mode, value, limits = getPaneLimits(mode)) {
    const handle = els.detailsResizeHandle;
    handle.setAttribute("aria-orientation", mode === "desktop" ? "vertical" : "horizontal");
    handle.setAttribute("aria-valuemin", String(limits.min));
    handle.setAttribute("aria-valuemax", String(limits.max));
    handle.setAttribute("aria-valuenow", String(Math.round(value)));
    handle.setAttribute("aria-valuetext", `${Math.round(value)} pixels`);
    handle.title = mode === "desktop"
      ? "Drag left or right to resize details"
      : "Drag up or down to resize details";
  }

  function startDetailsResize(event) {
    if (event.pointerType === "mouse" && event.button !== 0) return;

    const mode = activeResizeMode();
    resizeDrag = {
      mode,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startSize: getCurrentPaneSize(mode)
    };

    event.preventDefault();
    els.detailsResizeHandle.setPointerCapture?.(event.pointerId);
    els.detailsPanel.classList.add("is-resizing");
    document.body.classList.add("is-resizing-details");
    els.detailsResizeHandle.addEventListener("pointermove", dragDetailsResize);
    els.detailsResizeHandle.addEventListener("pointerup", stopDetailsResize);
    els.detailsResizeHandle.addEventListener("pointercancel", stopDetailsResize);
  }

  function dragDetailsResize(event) {
    if (!resizeDrag || event.pointerId !== resizeDrag.pointerId) return;

    const delta = resizeDrag.mode === "desktop"
      ? resizeDrag.startX - event.clientX
      : resizeDrag.startY - event.clientY;
    setDetailsSize(resizeDrag.mode, resizeDrag.startSize + delta, false);
  }

  function stopDetailsResize(event) {
    if (!resizeDrag || event.pointerId !== resizeDrag.pointerId) return;

    const mode = resizeDrag.mode;
    resizeDrag = null;
    els.detailsResizeHandle.releasePointerCapture?.(event.pointerId);
    els.detailsResizeHandle.removeEventListener("pointermove", dragDetailsResize);
    els.detailsResizeHandle.removeEventListener("pointerup", stopDetailsResize);
    els.detailsResizeHandle.removeEventListener("pointercancel", stopDetailsResize);
    els.detailsPanel.classList.remove("is-resizing");
    document.body.classList.remove("is-resizing-details");
    setDetailsSize(mode, getCurrentPaneSize(mode), true);
  }

  function handleResizeKeydown(event) {
    const mode = activeResizeMode();
    const size = getCurrentPaneSize(mode);
    const limits = getPaneLimits(mode);
    const step = event.shiftKey ? 48 : 24;
    let next = null;

    if (event.key === "Home") next = limits.min;
    if (event.key === "End") next = limits.max;
    if (mode === "desktop" && event.key === "ArrowLeft") next = size + step;
    if (mode === "desktop" && event.key === "ArrowRight") next = size - step;
    if (mode === "mobile" && event.key === "ArrowUp") next = size + step;
    if (mode === "mobile" && event.key === "ArrowDown") next = size - step;

    if (next === null) return;
    event.preventDefault();
    setDetailsSize(mode, next, true);
  }

  function scheduleTreeRefresh() {
    if (resizeFrame) cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(() => {
      resizeFrame = null;
      window.AB.tree?.drawEdges();
    });
  }

  function renderSiteFooter(data) {
    if (!els.siteFooter) return;
    const year = new Date().getFullYear();
    const version = data?.siteVersion || "1.01";
    els.siteFooter.textContent = `Copyright © ${year} Armchair Botanist · Version ${version}`;
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
    const sourceBlock = renderSourceBlock(source, wiki);

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
    const figures = figuresForNode(node);
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
                <p class="figure-caption-text">
                  ${escapeHtml(figure.caption || "")}
                  ${renderInlineSource(source)}
                </p>
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

  function figuresForNode(node) {
    const catalog = window.PLANT_TREE_DATA.figures || {};
    const catalogFigures = (node.figureIds || [])
      .map((figureId) => catalog[figureId])
      .filter(Boolean);
    return [...catalogFigures, ...(node.figures || [])];
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

    if (!photos.length) return "";

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

  function renderSourceBlock(source, wiki) {
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

  function renderLoadError(error) {
    els.tree.innerHTML = `
      <div class="load-error">
        <strong>Could not load plant tree data.</strong>
        <span>${escapeHtml(error.message || "Check plant-tree-data.js.")}</span>
      </div>
    `;
  }

  window.AB.details = {
    init,
    renderSiteFooter,
    refreshDetails,
    renderLoadError
  };
})();
