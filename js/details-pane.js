(function () {
  const { state, els, utils } = window.AB;
  const { escapeHtml, capitalize, limitSentences } = utils;

  function init() {
    els.imageViewerClose?.addEventListener("click", closeImageViewer);
    els.imageViewer?.addEventListener("click", (event) => {
      if (event.target === els.imageViewer) closeImageViewer();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !els.imageViewer?.hidden) closeImageViewer();
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
