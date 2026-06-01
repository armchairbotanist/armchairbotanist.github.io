(function () {
  const LEARN_CONFIG = {
    rootId: "angiosperms",
    groupRanks: ["clade", "grade"],
    terminalRank: "order",
    levelStorageKey: "armchair-botanist-learning-level",
    orderCommonExamples: {
      amborellales: ["Amborella"],
      nymphaeales: ["water lilies", "giant water lilies"],
      austrobaileyales: ["star anise"],
      canellales: ["wild cinnamon"],
      piperales: ["black pepper", "kava", "birthworts", "lizard's-tail"],
      magnoliales: ["magnolias", "tulip trees", "custard apples", "soursop", "nutmeg"],
      laurales: ["avocado", "cinnamon", "bay laurel", "sassafras"],
      acorales: ["sweet flag"],
      alismatales: ["taro", "duckweed", "seagrasses", "eelgrass", "pondweeds", "water-plantain"],
      petrosaviales: ["Petrosavia"],
      dioscoreales: ["true yams", "black bryony"],
      pandanales: ["screw pines", "pandan"],
      liliales: ["lilies", "tulips", "trilliums", "colchicums", "greenbriers"],
      asparagales: ["orchids", "irises", "daffodils", "onions", "asparagus", "aloes", "agaves"],
      arecales: ["palms", "coconut", "date palm", "oil palm"],
      commelinales: ["spiderworts", "water hyacinth"],
      zingiberales: ["ginger", "turmeric", "bananas", "bird-of-paradise", "cannas"],
      poales: ["grasses", "wheat", "bamboo", "sugarcane", "sedges", "bromeliads", "cattails"],
      ranunculales: ["buttercups", "poppies", "barberries", "columbines"],
      proteales: ["lotus", "plane trees", "macadamias", "banksias", "proteas"],
      gunnerales: ["giant rhubarb"],
      dilleniales: ["Dillenia"],
      saxifragales: ["peonies", "currants", "stonecrops", "witch-hazels", "sweetgum"],
      vitales: ["grapes", "Virginia creeper"],
      zygophyllales: ["creosote bush", "caltrops", "lignum vitae"],
      fabales: ["peas", "beans", "clover", "soybean", "peanuts", "acacias"],
      rosales: ["roses", "apples", "strawberries", "figs", "mulberries", "cannabis", "elms", "nettles"],
      fagales: ["oaks", "beeches", "birches", "walnuts", "hazelnuts"],
      cucurbitales: ["cucumbers", "pumpkins", "squashes", "melons", "begonias"],
      oxalidales: ["wood-sorrels", "starfruit"],
      malpighiales: ["willows", "violets", "passionflowers", "flax", "cassava", "poinsettias"],
      celastrales: ["bittersweet", "spindle trees"],
      geraniales: ["geraniums"],
      myrtales: ["eucalyptus", "myrtles", "cloves", "guava", "pomegranates", "evening primroses"],
      crossosomatales: ["Crossosoma"],
      sapindales: ["maples", "citrus", "mango", "cashews", "lychees", "horse chestnuts", "mahogany"],
      brassicales: ["cabbage", "mustard", "broccoli", "papaya", "capers", "nasturtiums"],
      malvales: ["cotton", "cacao", "hibiscus", "okra", "baobab", "linden"],
      santalales: ["sandalwood", "mistletoe"],
      caryophyllales: ["cacti", "spinach", "beets", "carnations", "bougainvillea", "sundews"],
      cornales: ["dogwoods", "hydrangeas"],
      ericales: ["tea", "blueberries", "cranberries", "rhododendrons", "azaleas", "persimmons", "Brazil nuts"],
      garryales: ["silk tassels", "aucubas"],
      gentianales: ["coffee", "gardenias", "madder", "gentians", "oleanders", "milkweeds"],
      boraginales: ["borage", "forget-me-nots", "comfrey", "heliotropes"],
      solanales: ["tomatoes", "potatoes", "peppers", "eggplants", "tobacco", "morning glories", "sweet potatoes"],
      lamiales: ["mint", "basil", "sage", "lavender", "olives", "ash trees", "snapdragons", "penstemon"],
      aquifoliales: ["holly"],
      asterales: ["sunflowers", "daisies", "lettuce", "dandelions", "asters", "bellflowers"],
      dipsacales: ["honeysuckles", "elderberries", "viburnums", "valerian"],
      apiales: ["carrots", "parsley", "celery", "dill", "ivy", "ginseng"]
    },
    levels: [
      {
        id: "level-1",
        label: "Level 1",
        orderIds: [
          "amborellales",
          "nymphaeales",
          "austrobaileyales",
          "magnoliales",
          "piperales",
          "laurales",
          "alismatales",
          "liliales",
          "asparagales",
          "arecales",
          "zingiberales",
          "poales",
          "ranunculales",
          "saxifragales",
          "fabales",
          "rosales",
          "fagales",
          "myrtales",
          "sapindales",
          "brassicales",
          "caryophyllales",
          "ericales",
          "solanales",
          "lamiales",
          "asterales",
          "apiales"
        ]
      },
      {
        id: "level-2",
        label: "Level 2",
        orderIds: "pdf-covered"
      }
    ]
  };

  /**
   * Runs the level-based angiosperm learning path from shared plant-tree data.
   */
  class PlantTreeLearning {
    /**
     * Stores shared tree data, lookup maps, page state, and DOM handles.
     */
    constructor(data, config) {
      this.data = data;
      this.config = config;
      this.groupRanks = new Set(config.groupRanks);
      this.byId = new Map();
      this.parentById = new Map();
      this.pages = [];
      this.currentIndex = 0;
      this.activeLevel = config.levels[0];
      this.appBaseUrl = new URL("../", document.currentScript.src).toString();
      this.els = {
        levelSelect: document.querySelector("#levelSelect"),
        stepLabel: document.querySelector("#stepLabel"),
        lessonContent: document.querySelector("#lessonContent"),
        previousStep: document.querySelector("#previousStep"),
        nextStep: document.querySelector("#nextStep"),
        learnFooter: document.querySelector("#learnFooter"),
        imageViewer: document.querySelector("#learnImageViewer"),
        imageViewerClose: document.querySelector("#learnImageViewerClose"),
        imageViewerImg: document.querySelector("#learnImageViewerImg"),
        imageViewerCaption: document.querySelector("#learnImageViewerCaption")
      };
    }

    /**
     * Hydrates local state, builds pages, and renders the initial page.
     */
    init() {
      if (!this.data?.rootId || !Array.isArray(this.data.nodes)) {
        this.renderLoadError("Plant tree data is missing or malformed.");
        return;
      }

      this.hydrateData();
      this.setupLevelSelector();
      this.pages = this.buildLearningPages();
      if (!this.pages.length) {
        this.renderLoadError("No angiosperm learning pages could be built.");
        return;
      }

      this.currentIndex = this.indexFromHash();
      this.bindEvents();
      this.render();
    }

    /**
     * Builds node and parent lookup maps from the shared plant tree data.
     */
    hydrateData() {
      for (const node of this.data.nodes) {
        this.byId.set(node.id, {
          ...node,
          children: node.children ? [...node.children] : []
        });
      }

      for (const node of this.byId.values()) {
        for (const childId of node.children || []) {
          if (this.byId.has(childId)) this.parentById.set(childId, node.id);
        }
      }
    }

    /**
     * Creates a depth-first sequence from Angiosperms through visible groups and orders.
     */
    buildLearningPages() {
      const root = this.byId.get(this.config.rootId);
      if (!root) return [];

      const pages = [];
      this.walkVisibleNodes(root, (node) => {
        pages.push({
          id: node.id,
          nodeId: node.id,
          kind: node.rank
        });
      });
      return pages;
    }

    /**
     * Visits page-worthy nodes, while still walking visible unpaged context nodes.
     */
    walkVisibleNodes(node, visit) {
      if (this.hasPage(node)) visit(node);
      if (node.rank === this.config.terminalRank) return;
      for (const child of this.visibleChildren(node)) this.walkVisibleNodes(child, visit);
    }

    /**
     * Wires navigation, keyboard shortcuts, hash changes, and image viewer events.
     */
    bindEvents() {
      this.els.previousStep.addEventListener("click", () => this.goToIndex(this.currentIndex - 1));
      this.els.nextStep.addEventListener("click", () => this.goToIndex(this.currentIndex + 1));
      this.els.levelSelect?.addEventListener("change", () => this.changeLevel(this.els.levelSelect.value));
      this.els.imageViewerClose.addEventListener("click", () => this.closeImageViewer());
      this.els.imageViewer.addEventListener("click", (event) => {
        if (event.target === this.els.imageViewer) this.closeImageViewer();
      });
      window.addEventListener("hashchange", () => {
        const nextIndex = this.indexFromHash();
        if (nextIndex !== this.currentIndex) {
          this.currentIndex = nextIndex;
          this.render();
        }
      });
      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !this.els.imageViewer.hidden) this.closeImageViewer();
        if (event.key === "ArrowLeft" && !this.isTyping(event.target)) this.goToIndex(this.currentIndex - 1);
        if (event.key === "ArrowRight" && !this.isTyping(event.target)) this.goToIndex(this.currentIndex + 1);
      });
    }

    /**
     * Fills the level selector and restores the most recent level choice.
     */
    setupLevelSelector() {
      this.activeLevel = this.levelForId(this.storedLevelId()) || this.config.levels[0];
      if (!this.els.levelSelect) return;

      this.els.levelSelect.innerHTML = this.config.levels.map((level) => `
        <option value="${this.escapeHtml(level.id)}">${this.escapeHtml(level.label)}</option>
      `).join("");
      this.els.levelSelect.value = this.activeLevel.id;
    }

    /**
     * Rebuilds the page sequence when the user chooses a different learning level.
     */
    changeLevel(levelId) {
      const nextLevel = this.levelForId(levelId);
      if (!nextLevel || nextLevel.id === this.activeLevel.id) return;

      this.activeLevel = nextLevel;
      this.storeLevelId(nextLevel.id);
      this.pages = this.buildLearningPages();
      this.currentIndex = 0;
      this.render();
    }

    /**
     * Renders the active page and navigation state.
     */
    render() {
      const page = this.pages[this.currentIndex];
      const node = this.byId.get(page?.nodeId);
      if (!node) return;

      this.els.stepLabel.textContent = `${this.currentIndex + 1} / ${this.pages.length}`;
      this.els.lessonContent.innerHTML = node.rank === this.config.terminalRank
        ? this.renderOrderPage(node)
        : this.renderGroupPage(node);

      this.syncNavigationButtons();
      this.renderFooter();
      this.bindDynamicControls();
      this.updateHash(page.id);
      this.els.lessonContent.scrollTo({ top: 0, behavior: "auto" });
    }

    /**
     * Renders a group page as only a heading and a mini tree.
     */
    renderGroupPage(node) {
      const children = this.visibleChildren(node);
      return `
        <h1>${this.escapeHtml(node.name)}</h1>
        ${this.renderLocationTrail(node)}
        ${children.length ? this.renderMiniTree(node, children) : ""}
      `;
    }

    /**
     * Renders an order page as a heading and any order-level PDF figures.
     */
    renderOrderPage(node) {
      const figures = this.figuresForNode(node);
      return `
        <h1>${this.escapeHtml(node.name)}</h1>
        ${this.renderLocationTrail(node)}
        ${this.renderOrderExamples(node)}
        ${figures.length ? this.renderFigureGrid(figures, node) : ""}
      `;
    }

    /**
     * Renders a compact common-plant overview for an order page.
     */
    renderOrderExamples(node) {
      const examples = this.orderExamplesForNode(node);
      if (!examples.length) return "";

      return `
        <section class="order-examples" aria-label="${this.escapeHtml(node.name)} examples">
          <p><strong>Examples:</strong> ${examples.map((example) => this.escapeHtml(example)).join(", ")}.</p>
        </section>
      `;
    }

    /**
     * Looks up curated common examples for an order page.
     */
    orderExamplesForNode(node) {
      return this.config.orderCommonExamples[node.id] || [];
    }

    /**
     * Renders a compact breadcrumb showing the visible route through the learning tree.
     */
    renderLocationTrail(node) {
      const path = this.visiblePathForNode(node);
      if (path.length <= 1) return "";

      return `
        <nav class="location-trail" aria-label="Location in angiosperm tree">
          ${path.map((pathNode, index) => {
            const isCurrent = index === path.length - 1;
            if (isCurrent) return `<span aria-current="page">${this.escapeHtml(pathNode.name)}</span>`;
            return `<button type="button" data-node-id="${this.escapeHtml(pathNode.id)}">${this.escapeHtml(pathNode.name)}</button>`;
          }).join('<span aria-hidden="true">/</span>')}
        </nav>
      `;
    }

    /**
     * Renders a mini tree from the current node to visible child groups/orders.
     */
    renderMiniTree(node, children) {
      return `
        <div class="mini-tree" aria-label="${this.escapeHtml(node.name)} child groups and orders">
          <div class="mini-tree-root">${this.escapeHtml(node.name)}</div>
          <div class="mini-tree-trunk" aria-hidden="true"></div>
          <div class="mini-child-grid">
            ${children.map((child) => this.renderChildNode(child)).join("")}
          </div>
        </div>
      `;
    }

    /**
     * Renders one child group/order node inside a mini tree.
     * Nodes without a learning page stay visible but are intentionally not clickable.
     */
    renderChildNode(node) {
      if (!this.hasPage(node)) {
        return `
          <div class="mini-child-node rank-${this.escapeHtml(node.rank)} is-unpaged" aria-label="${this.escapeHtml(node.name)} has no learning page yet">
            <strong>${this.escapeHtml(node.name)}</strong>
          </div>
        `;
      }

      return `
        <button class="mini-child-node rank-${this.escapeHtml(node.rank)}" type="button" data-node-id="${this.escapeHtml(node.id)}">
          <strong>${this.escapeHtml(node.name)}</strong>
        </button>
      `;
    }

    /**
     * Attaches click handlers to generated child-node buttons and images.
     */
    bindDynamicControls() {
      this.els.lessonContent.querySelectorAll("[data-node-id]").forEach((button) => {
        button.addEventListener("click", () => {
          const targetIndex = this.pages.findIndex((page) => page.nodeId === button.dataset.nodeId);
          this.goToIndex(targetIndex);
        });
      });

      this.els.lessonContent.querySelectorAll("[data-image-src]").forEach((button) => {
        button.addEventListener("click", () => {
          this.openImageViewer(button.dataset.imageSrc, button.dataset.imageAlt, button.dataset.imageCaption);
        });
      });
    }

    /**
     * Enables, disables, and labels the two navigation buttons.
     */
    syncNavigationButtons() {
      const previousDisabled = this.currentIndex === 0;
      const nextDisabled = this.currentIndex >= this.pages.length - 1;
      this.els.previousStep.disabled = previousDisabled;
      this.els.nextStep.disabled = nextDisabled;
      this.els.previousStep.textContent = previousDisabled
        ? "Previous"
        : `Previous: ${this.shortPageLabel(this.pages[this.currentIndex - 1])}`;
      this.els.nextStep.textContent = nextDisabled
        ? "Next"
        : `Next: ${this.shortPageLabel(this.pages[this.currentIndex + 1])}`;
    }

    /**
     * Writes the compact copyright/version footer.
     */
    renderFooter() {
      const year = new Date().getFullYear();
      this.els.learnFooter.textContent = `Copyright © ${year} Armchair Botanist · Version ${this.data.siteVersion || "2.x"}`;
    }

    /**
     * Moves to a valid page index.
     */
    goToIndex(index) {
      if (!Number.isFinite(index)) return;
      const nextIndex = Math.max(0, Math.min(this.pages.length - 1, index));
      if (nextIndex === this.currentIndex) return;
      this.currentIndex = nextIndex;
      this.render();
    }

    /**
     * Reads the current hash and finds the matching page index.
     */
    indexFromHash() {
      const id = window.location.hash.replace(/^#/, "");
      const index = this.pages.findIndex((page) => page.id === id);
      return index >= 0 ? index : 0;
    }

    /**
     * Keeps the URL hash in sync without triggering browser scroll.
     */
    updateHash(id) {
      if (window.location.hash === `#${id}`) return;
      history.replaceState(null, "", `#${id}`);
    }

    /**
     * Returns direct child nodes for a node.
     */
    childNodes(node) {
      return (node?.children || []).map((id) => this.byId.get(id)).filter(Boolean);
    }

    /**
     * Returns visible child groups/orders. Group nodes always stay visible; order nodes may
     * be clickable pages or pale context nodes depending on the selected learning level.
     */
    visibleChildren(node) {
      const visible = [];
      for (const child of this.childNodes(node)) {
        if (child.rank === this.config.terminalRank) {
          visible.push(child);
          continue;
        }

        if (!this.groupRanks.has(child.rank)) continue;
        visible.push(child);
      }
      return visible;
    }

    /**
     * Finds the visible learning path from the root to a node.
     */
    visiblePathForNode(targetNode) {
      const root = this.byId.get(this.config.rootId);
      if (!root) return [targetNode];
      return this.findVisiblePath(root, targetNode.id) || [targetNode];
    }

    /**
     * Recursively searches visible children for a target node id.
     */
    findVisiblePath(node, targetId) {
      if (node.id === targetId) return [node];
      for (const child of this.visibleChildren(node)) {
        const childPath = this.findVisiblePath(child, targetId);
        if (childPath) return [node, ...childPath];
      }
      return null;
    }

    /**
     * Returns whether a visible node should have its own page in the sequence.
     */
    hasPage(node) {
      if (node.id === this.config.rootId) return true;
      if (node.rank === this.config.terminalRank) return this.orderHasPage(node);
      if (this.groupRanks.has(node.rank)) return true;
      return false;
    }

    /**
     * Checks whether an order belongs to the active level's page list.
     */
    orderHasPage(node) {
      if (this.activeLevel.orderIds === "pdf-covered") return this.figuresForNode(node).length > 0;
      return Array.isArray(this.activeLevel.orderIds) && this.activeLevel.orderIds.includes(node.id);
    }

    /**
     * Finds a level config by id.
     */
    levelForId(levelId) {
      return this.config.levels.find((level) => level.id === levelId);
    }

    /**
     * Reads the persisted learning level, ignoring unavailable browser storage.
     */
    storedLevelId() {
      try {
        return window.localStorage.getItem(this.config.levelStorageKey);
      } catch {
        return null;
      }
    }

    /**
     * Persists the selected learning level, ignoring unavailable browser storage.
     */
    storeLevelId(levelId) {
      try {
        window.localStorage.setItem(this.config.levelStorageKey, levelId);
      } catch {
        // Local storage can be disabled in private browsing modes.
      }
    }

    /**
     * Resolves a node's figure IDs to local figure records.
     */
    figuresForNode(node) {
      const catalog = this.data.figures || {};
      return (node?.figureIds || []).map((figureId) => catalog[figureId]).filter(Boolean);
    }

    /**
     * Renders all figures and source captions for an order page.
     */
    renderFigureGrid(figures, node) {
      return `
        <div class="figure-grid">
          ${figures.map((figure) => `
            <figure class="learn-figure">
              ${this.renderImageButton(figure, node)}
              <figcaption>${this.escapeHtml(figure.caption || "")}</figcaption>
            </figure>
          `).join("")}
        </div>
      `;
    }

    /**
     * Renders a clickable image button that opens the large image viewer.
     */
    renderImageButton(figure, node = null) {
      const src = this.resolveAssetUrl(figure.image);
      const caption = figure.caption || "";
      const alt = figure.alt || caption || node?.name || "Plant figure";
      return `
        <button type="button" data-image-src="${this.escapeHtml(src)}" data-image-alt="${this.escapeHtml(alt)}" data-image-caption="${this.escapeHtml(caption)}" aria-label="Open larger image: ${this.escapeHtml(figure.figureNumber || node?.name || "figure")}">
          <img src="${this.escapeHtml(src)}" alt="${this.escapeHtml(alt)}" loading="lazy">
        </button>
      `;
    }

    /**
     * Opens the full-screen image viewer.
     */
    openImageViewer(src, alt, caption) {
      if (!src) return;
      this.els.imageViewerImg.src = src;
      this.els.imageViewerImg.alt = alt || caption || "Expanded image";
      this.els.imageViewerCaption.textContent = caption || "";
      this.els.imageViewer.hidden = false;
      this.els.imageViewerClose.focus({ preventScroll: true });
    }

    /**
     * Closes and clears the full-screen image viewer.
     */
    closeImageViewer() {
      this.els.imageViewer.hidden = true;
      this.els.imageViewerImg.removeAttribute("src");
      this.els.imageViewerImg.alt = "";
      this.els.imageViewerCaption.textContent = "";
    }

    /**
     * Produces a short label for next/previous buttons.
     */
    shortPageLabel(page) {
      if (!page) return "";
      const node = this.byId.get(page.nodeId);
      return node?.name || "page";
    }

    /**
     * Resolves project-relative asset paths from the nested learn route.
     */
    resolveAssetUrl(value) {
      const raw = String(value || "").trim();
      if (!raw) return "";
      if (/^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(raw)) return raw;
      if (raw.startsWith("/")) return raw;
      return new URL(raw, this.appBaseUrl).toString();
    }

    /**
     * Detects text-entry targets so arrow shortcuts do not interfere with typing.
     */
    isTyping(target) {
      return Boolean(target?.closest?.("input, textarea, select, [contenteditable='true']"));
    }

    /**
     * Escapes strings for safe HTML interpolation.
     */
    escapeHtml(value) {
      return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
    }

    /**
     * Shows a readable load error when data cannot initialize.
     */
    renderLoadError(message) {
      this.els.lessonContent.innerHTML = `
        <div class="learn-load-error">
          <strong>Could not load learning data.</strong>
          <p>${this.escapeHtml(message)}</p>
        </div>
      `;
    }
  }

  new PlantTreeLearning(window.PLANT_TREE_DATA, LEARN_CONFIG).init();
})();
