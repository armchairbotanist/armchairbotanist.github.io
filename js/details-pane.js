(function () {
  /**
   * Owns the right-hand fact pane: node details, source figures, enrichment fetches,
   * image previewing, footer version text, and pane resizing.
   */
  class DetailsPane {
    /**
     * Stores shared app state and prepares bound handlers that need stable references.
     */
    constructor(app) {
      this.config = app.config;
      this.state = app.state;
      this.els = app.els;
      this.utils = app.utils;
      this.paneConfig = this.config.detailsPane;
      this.photoConfig = this.config.photos;
      this.desktopResizeQuery = window.matchMedia(this.config.media.detailsPaneDesktop);
      this.resizeDrag = null;
      this.resizeFrame = null;

      this.applyStoredDetailsSize = this.applyStoredDetailsSize.bind(this);
      this.clampActiveDetailsSize = this.clampActiveDetailsSize.bind(this);
      this.dragDetailsResize = this.dragDetailsResize.bind(this);
      this.stopDetailsResize = this.stopDetailsResize.bind(this);
    }

    /**
     * Registers fact-pane interactions: resizing, image viewer close actions,
     * and Escape-to-close behavior.
     */
    init() {
      this.setupDetailsResize();
      this.els.imageViewerClose?.addEventListener("click", () => this.closeImageViewer());
      this.els.imageViewer?.addEventListener("click", (event) => {
        if (event.target === this.els.imageViewer) this.closeImageViewer();
      });
      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !this.els.imageViewer?.hidden) this.closeImageViewer();
      });
    }

    /**
     * Enables drag and keyboard resizing for the fact pane.
     * Desktop resizes horizontally; phone-sized layouts resize vertically.
     */
    setupDetailsResize() {
      if (!this.els.appShell || !this.els.detailsPanel || !this.els.detailsResizeHandle) return;

      this.applyStoredDetailsSize();
      this.els.detailsResizeHandle.addEventListener("pointerdown", (event) => this.startDetailsResize(event));
      this.els.detailsResizeHandle.addEventListener("keydown", (event) => this.handleResizeKeydown(event));
      window.addEventListener("resize", this.clampActiveDetailsSize);

      if (this.desktopResizeQuery.addEventListener) {
        this.desktopResizeQuery.addEventListener("change", this.applyStoredDetailsSize);
      } else {
        this.desktopResizeQuery.addListener(this.applyStoredDetailsSize);
      }
    }

    /**
     * Returns which resize axis is active for the current viewport.
     */
    activeResizeMode() {
      return this.desktopResizeQuery.matches ? "desktop" : "mobile";
    }

    /**
     * Builds the version-scoped localStorage key for a saved pane size.
     */
    storageKey(mode) {
      return `${this.config.storagePrefix}:${this.siteVersion()}:details-pane:${mode}`;
    }

    /**
     * Reads a saved pane size, returning null when storage is unavailable or empty.
     */
    readStoredSize(mode) {
      try {
        const value = Number.parseFloat(window.localStorage.getItem(this.storageKey(mode)));
        return Number.isFinite(value) ? value : null;
      } catch (_error) {
        return null;
      }
    }

    /**
     * Saves a pane size for the active site version.
     */
    writeStoredSize(mode, value) {
      try {
        window.localStorage.setItem(this.storageKey(mode), String(Math.round(value)));
      } catch (_error) {
        // Private browsing can disable storage; resizing should still work for the session.
      }
    }

    /**
     * Restores the saved pane size for the current mode, then clamps it to the viewport.
     */
    applyStoredDetailsSize() {
      const mode = this.activeResizeMode();
      const stored = this.readStoredSize(mode);
      this.setDetailsSize(mode, stored || this.getCurrentPaneSize(mode), false);
    }

    /**
     * Keeps the current pane size valid after browser resizing or orientation changes.
     */
    clampActiveDetailsSize() {
      const mode = this.activeResizeMode();
      this.setDetailsSize(mode, this.getCurrentPaneSize(mode), false);
    }

    /**
     * Reads the current rendered pane width or height for the active resize mode.
     */
    getCurrentPaneSize(mode) {
      const box = this.els.detailsPanel.getBoundingClientRect();
      return mode === "desktop" ? box.width : box.height;
    }

    /**
     * Calculates min/max pane sizes while preserving enough room for the tree.
     */
    getPaneLimits(mode) {
      const shellBox = this.els.appShell.getBoundingClientRect();

      if (mode === "desktop") {
        const desktop = this.paneConfig.desktop;
        const min = Math.min(desktop.minPx, Math.max(desktop.compactMinPx, shellBox.width - desktop.compactTreePx));
        const max = Math.max(min, Math.min(desktop.maxPx, shellBox.width - desktop.minTreePx));
        return { min: Math.round(min), max: Math.round(max) };
      }

      const mobile = this.paneConfig.mobile;
      const min = Math.max(mobile.minPx, Math.min(mobile.compactMaxPx, shellBox.height * mobile.minRatio));
      const max = Math.max(min, Math.min(shellBox.height - mobile.maxTreePx, shellBox.height * mobile.maxRatio));
      return { min: Math.round(min), max: Math.round(max) };
    }

    /**
     * Restricts a numeric value to a min/max range.
     */
    clamp(value, min, max) {
      return Math.min(max, Math.max(min, value));
    }

    /**
     * Applies a pane size to CSS variables and updates separator ARIA metadata.
     */
    setDetailsSize(mode, value, persist) {
      const limits = this.getPaneLimits(mode);
      const next = Math.round(this.clamp(value, limits.min, limits.max));
      const property = mode === "desktop" ? "--details-pane-width" : "--details-pane-height";
      document.documentElement.style.setProperty(property, `${next}px`);
      this.syncResizeHandle(mode, next, limits);
      if (persist) this.writeStoredSize(mode, next);
      this.scheduleTreeRefresh();
      return next;
    }

    /**
     * Keeps the resize handle's accessibility state in sync with the visual size.
     */
    syncResizeHandle(mode, value, limits = this.getPaneLimits(mode)) {
      const handle = this.els.detailsResizeHandle;
      handle.setAttribute("aria-orientation", mode === "desktop" ? "vertical" : "horizontal");
      handle.setAttribute("aria-valuemin", String(limits.min));
      handle.setAttribute("aria-valuemax", String(limits.max));
      handle.setAttribute("aria-valuenow", String(Math.round(value)));
      handle.setAttribute("aria-valuetext", `${Math.round(value)} pixels`);
      handle.title = mode === "desktop"
        ? "Drag left or right to resize details"
        : "Drag up or down to resize details";
    }

    /**
     * Starts a pointer drag for the resize handle.
     */
    startDetailsResize(event) {
      if (event.pointerType === "mouse" && event.button !== 0) return;

      const mode = this.activeResizeMode();
      this.resizeDrag = {
        mode,
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        startSize: this.getCurrentPaneSize(mode)
      };

      event.preventDefault();
      try {
        this.els.detailsResizeHandle.setPointerCapture?.(event.pointerId);
      } catch (_error) {
        // Window-level listeners keep dragging reliable even if capture is unavailable.
      }
      this.els.detailsPanel.classList.add("is-resizing");
      document.body.classList.add("is-resizing-details");
      window.addEventListener("pointermove", this.dragDetailsResize);
      window.addEventListener("pointerup", this.stopDetailsResize);
      window.addEventListener("pointercancel", this.stopDetailsResize);
    }

    /**
     * Updates the pane size as the resize pointer moves.
     */
    dragDetailsResize(event) {
      if (!this.resizeDrag || event.pointerId !== this.resizeDrag.pointerId) return;

      const delta = this.resizeDrag.mode === "desktop"
        ? this.resizeDrag.startX - event.clientX
        : this.resizeDrag.startY - event.clientY;
      this.setDetailsSize(this.resizeDrag.mode, this.resizeDrag.startSize + delta, false);
    }

    /**
     * Finishes a resize drag, removes global listeners, and persists the final size.
     */
    stopDetailsResize(event) {
      if (!this.resizeDrag || event.pointerId !== this.resizeDrag.pointerId) return;

      const mode = this.resizeDrag.mode;
      this.resizeDrag = null;
      try {
        this.els.detailsResizeHandle.releasePointerCapture?.(event.pointerId);
      } catch (_error) {
        // The pointer may already be released by the browser.
      }
      window.removeEventListener("pointermove", this.dragDetailsResize);
      window.removeEventListener("pointerup", this.stopDetailsResize);
      window.removeEventListener("pointercancel", this.stopDetailsResize);
      this.els.detailsPanel.classList.remove("is-resizing");
      document.body.classList.remove("is-resizing-details");
      this.setDetailsSize(mode, this.getCurrentPaneSize(mode), true);
    }

    /**
     * Supports keyboard resizing from the separator for accessibility.
     */
    handleResizeKeydown(event) {
      const mode = this.activeResizeMode();
      const size = this.getCurrentPaneSize(mode);
      const limits = this.getPaneLimits(mode);
      const modeConfig = this.paneConfig[mode];
      const step = event.shiftKey ? modeConfig.keyboardLargeStepPx : modeConfig.keyboardStepPx;
      let next = null;

      if (event.key === "Home") next = limits.min;
      if (event.key === "End") next = limits.max;
      if (mode === "desktop" && event.key === "ArrowLeft") next = size + step;
      if (mode === "desktop" && event.key === "ArrowRight") next = size - step;
      if (mode === "mobile" && event.key === "ArrowUp") next = size + step;
      if (mode === "mobile" && event.key === "ArrowDown") next = size - step;

      if (next === null) return;
      event.preventDefault();
      this.setDetailsSize(mode, next, true);
    }

    /**
     * Redraws tree edges after pane resizing changes available tree space.
     */
    scheduleTreeRefresh() {
      if (this.resizeFrame) cancelAnimationFrame(this.resizeFrame);
      this.resizeFrame = requestAnimationFrame(() => {
        this.resizeFrame = null;
        window.AB.tree?.drawEdges();
      });
    }

    /**
     * Writes the footer copyright/version text.
     */
    renderSiteFooter(data) {
      if (!this.els.siteFooter) return;
      const year = new Date().getFullYear();
      this.els.siteFooter.textContent = `Copyright © ${year} Armchair Botanist · Version ${this.siteVersion(data)}`;
    }

    /**
     * Reads the visible site version from data, with a config fallback.
     */
    siteVersion(data = window.PLANT_TREE_DATA) {
      return data?.siteVersion || this.config.fallbackSiteVersion;
    }

    /**
     * Renders local node details immediately, then refreshes with remote enrichment.
     */
    async refreshDetails(nodeId) {
      const node = this.state.byId.get(nodeId);
      if (!node) return;
      this.renderDetails(node);

      try {
        const [wiki, photos] = await Promise.all([
          this.fetchWikipediaDetails(node),
          this.fetchINaturalistPhotos(node)
        ]);
        if (this.state.activeId === nodeId) this.renderDetails(node, wiki, photos);
      } catch (error) {
        console.warn("Details enrichment unavailable", error);
      }
    }

    /**
     * Writes the complete fact pane markup for one node.
     */
    renderDetails(node, wiki = null, photos = null) {
      const source = window.PLANT_TREE_DATA.sources[node.source];
      this.els.detailsContent.innerHTML = `
        <h2>${this.utils.escapeHtml(node.name)}</h2>
        <p class="details-rank">${this.utils.escapeHtml(this.utils.capitalize(node.rank))}</p>
        <p class="details-path">${this.utils.escapeHtml(node.pathString || node.name)}</p>
        ${this.renderOverviewBlock(node, wiki)}
        ${this.renderFactsBlock(node)}
        ${this.renderFigureBlock(node)}
        ${this.renderPhotoBlock(photos)}
        ${this.renderSourceBlock(source, wiki)}
      `;
      this.bindFigureViewer();
    }

    /**
     * Renders curated node-specific facts, each with its inline source reference.
     */
    renderFactsBlock(node) {
      const facts = (node.facts || []).slice(0, 5);
      if (!facts.length) return "";

      return `
        <section class="details-section facts-section">
          <ul class="trait-list">
            ${facts.map((fact) => {
              const source = window.PLANT_TREE_DATA.sources[fact.source];
              return `
                <li>
                  ${this.utils.escapeHtml(fact.text)}
                  ${this.renderInlineSource(source)}
                </li>
              `;
            }).join("")}
          </ul>
        </section>
      `;
    }

    /**
     * Renders local source figures and captions connected to the selected node.
     */
    renderFigureBlock(node) {
      const figures = this.figuresForNode(node);
      if (!figures.length) return "";

      return `
        <section class="details-section figure-section">
          ${figures.map((figure) => {
            const source = window.PLANT_TREE_DATA.sources[figure.source];
            return `
              <figure class="source-figure">
                <button class="figure-image-button" type="button" aria-label="Open larger image: ${this.utils.escapeHtml(figure.caption || node.name)}">
                  <img src="${this.utils.escapeHtml(figure.image)}" alt="${this.utils.escapeHtml(figure.alt || figure.caption || node.name)}" loading="lazy">
                </button>
                <figcaption>
                  <p class="figure-caption-text">
                    ${this.utils.escapeHtml(figure.caption || "")}
                    ${this.renderInlineSource(source)}
                  </p>
                  ${figure.panels?.length ? `
                    <ul>
                      ${figure.panels.map((panel) => `<li>${this.utils.escapeHtml(panel)}</li>`).join("")}
                    </ul>
                  ` : ""}
                </figcaption>
              </figure>
            `;
          }).join("")}
        </section>
      `;
    }

    /**
     * Resolves a node's figure IDs into full figure records.
     */
    figuresForNode(node) {
      const catalog = window.PLANT_TREE_DATA.figures || {};
      const catalogFigures = (node.figureIds || [])
        .map((figureId) => catalog[figureId])
        .filter(Boolean);
      return [...catalogFigures, ...(node.figures || [])];
    }

    /**
     * Attaches image-viewer click handlers to the newly rendered figure thumbnails.
     */
    bindFigureViewer() {
      this.els.detailsContent.querySelectorAll(".figure-image-button").forEach((button) => {
        button.addEventListener("click", () => {
          const image = button.querySelector("img");
          const figure = button.closest(".source-figure");
          const caption = figure?.querySelector("figcaption")?.textContent?.replace(/\s+/g, " ").trim() || "";
          this.openImageViewer(image?.getAttribute("src"), image?.getAttribute("alt"), caption);
        });
      });
    }

    /**
     * Opens a full-screen image viewer for a source figure.
     */
    openImageViewer(src, alt, caption) {
      if (!src || !this.els.imageViewer || !this.els.imageViewerImg || !this.els.imageViewerCaption) return;
      this.els.imageViewerImg.src = src;
      this.els.imageViewerImg.alt = alt || caption || "Expanded image";
      this.els.imageViewerCaption.textContent = caption || "";
      this.els.imageViewer.hidden = false;
      document.body.classList.add("has-image-viewer");
      this.els.imageViewerClose?.focus({ preventScroll: true });
    }

    /**
     * Closes and clears the full-screen image viewer.
     */
    closeImageViewer() {
      if (!this.els.imageViewer || this.els.imageViewer.hidden) return;
      this.els.imageViewer.hidden = true;
      document.body.classList.remove("has-image-viewer");
      if (this.els.imageViewerImg) {
        this.els.imageViewerImg.removeAttribute("src");
        this.els.imageViewerImg.alt = "";
      }
      if (this.els.imageViewerCaption) this.els.imageViewerCaption.textContent = "";
    }

    /**
     * Renders an inline source label as a link when the source has a URL.
     */
    renderInlineSource(source) {
      if (!source) return "";
      if (source.url) {
        return `<a class="inline-source" href="${this.utils.escapeHtml(source.url)}" target="_blank" rel="noopener">${this.utils.escapeHtml(source.label)}</a>`;
      }
      return `<span class="inline-source">${this.utils.escapeHtml(source.label)}</span>`;
    }

    /**
     * Renders iNaturalist photo thumbnails, including the loading placeholder state.
     */
    renderPhotoBlock(photos) {
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
              <a href="${this.utils.escapeHtml(photo.observationUrl)}" target="_blank" rel="noopener" title="${this.utils.escapeHtml(photo.attribution)}">
                <img src="${this.utils.escapeHtml(photo.url)}" alt="${this.utils.escapeHtml(photo.alt)}" loading="lazy">
              </a>
            `).join("")}
          </div>
          <p class="details-muted">Photos are from iNaturalist research-grade observations when available. Open a photo for observation and attribution details.</p>
        </section>
      `;
    }

    /**
     * Renders the node description plus a shortened Wikipedia extract when available.
     */
    renderOverviewBlock(node, wiki) {
      const paragraphs = [];
      if (node.description) paragraphs.push(node.description);
      if (wiki?.extract) paragraphs.push(this.utils.limitSentences(wiki.extract, 4));

      if (!paragraphs.length) {
        return `<p class="details-muted">Loading overview when available...</p>`;
      }

      return `
        <div class="details-copy overview-copy">
          ${paragraphs.map((paragraph) => `<p>${this.utils.escapeHtml(paragraph)}</p>`).join("")}
        </div>
      `;
    }

    /**
     * Renders the source footer for local data and optional Wikipedia enrichment.
     */
    renderSourceBlock(source, wiki) {
      return `
        <footer class="details-sources">
          <p>${this.utils.escapeHtml(source?.citation || "Source citation missing.")}</p>
          <div class="details-links">
            ${source?.url ? `<a href="${this.utils.escapeHtml(source.url)}" target="_blank" rel="noopener">Source reference</a>` : ""}
            ${wiki?.content_urls?.desktop?.page ? `<a href="${this.utils.escapeHtml(wiki.content_urls.desktop.page)}" target="_blank" rel="noopener">Wikipedia</a>` : ""}
          </div>
        </footer>
      `;
    }

    /**
     * Fetches and caches a Wikipedia summary for the selected node name.
     */
    async fetchWikipediaDetails(node) {
      if (this.state.wikiCache.has(node.name)) return this.state.wikiCache.get(node.name);

      const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(node.name)}`);
      if (!response.ok) {
        this.state.wikiCache.set(node.name, null);
        return null;
      }

      const data = await response.json();
      this.state.wikiCache.set(node.name, data);
      return data;
    }

    /**
     * Fetches research-grade iNaturalist observation photos for supported taxon ranks.
     */
    async fetchINaturalistPhotos(node) {
      const photoQuery = this.photoTaxonFor(node);
      if (!photoQuery) return [];
      if (this.state.photoCache.has(photoQuery)) return this.state.photoCache.get(photoQuery);

      const taxonId = await this.resolveINaturalistTaxonId(photoQuery);
      if (!taxonId) {
        this.state.photoCache.set(photoQuery, []);
        return [];
      }

      const params = new URLSearchParams({
        taxon_id: String(taxonId),
        photos: "true",
        quality_grade: this.photoConfig.qualityGrade,
        verifiable: "true",
        per_page: String(this.photoConfig.maxPhotos),
        order_by: this.photoConfig.orderBy
      });
      const response = await fetch(`https://api.inaturalist.org/v1/observations?${params.toString()}`);
      if (!response.ok) {
        this.state.photoCache.set(photoQuery, []);
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
        .slice(0, this.photoConfig.maxPhotos);

      this.state.photoCache.set(photoQuery, photos);
      return photos;
    }

    /**
     * Looks up an exact iNaturalist taxon id for a scientific name.
     */
    async resolveINaturalistTaxonId(query) {
      const params = new URLSearchParams({
        q: query,
        is_active: "true",
        per_page: String(this.photoConfig.taxonAutocompleteLimit)
      });
      const response = await fetch(`https://api.inaturalist.org/v1/taxa/autocomplete?${params.toString()}`);
      if (!response.ok) return null;

      const data = await response.json();
      const exact = (data.results || []).find((taxon) =>
        taxon.name?.toLowerCase() === query.toLowerCase()
      );
      return exact?.id || null;
    }

    /**
     * Chooses which taxon name should be used for photo lookup.
     */
    photoTaxonFor(node) {
      if (node.photoTaxon) return node.photoTaxon;
      if (node.rank === "order" || node.rank === "family" || node.rank === "genus") return node.name;
      return null;
    }

    /**
     * Shows a readable data-load error inside the tree area.
     */
    renderLoadError(error) {
      this.els.tree.innerHTML = `
        <div class="load-error">
          <strong>Could not load plant tree data.</strong>
          <span>${this.utils.escapeHtml(error.message || "Check plant-tree-data.js.")}</span>
        </div>
      `;
    }
  }

  window.AB.DetailsPane = DetailsPane;
  window.AB.details = new DetailsPane(window.AB);
})();
