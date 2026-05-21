(function () {
  /**
   * Owns the expandable tree UI: data hydration, node rendering, expansion state,
   * scroll positioning, and SVG edge drawing.
   */
  class TreeView {
    /**
     * Stores shared app state, DOM handles, and utility functions used by the tree.
     */
    constructor(app) {
      this.config = app.config;
      this.state = app.state;
      this.els = app.els;
      this.getChildren = app.getChildren;
      this.utils = app.utils;
      this.viewportPan = null;
      this.drawEdges = this.drawEdges.bind(this);
      this.startViewportPan = this.startViewportPan.bind(this);
      this.updateViewportPan = this.updateViewportPan.bind(this);
      this.stopViewportPan = this.stopViewportPan.bind(this);
    }

    /**
     * Registers long-lived tree listeners.
     * The edge overlay is redrawn whenever the viewport changes size.
     */
    init() {
      window.addEventListener("resize", this.drawEdges);
      this.els.treeViewport.addEventListener("pointerdown", this.startViewportPan);
      this.els.treeViewport.addEventListener("pointermove", this.updateViewportPan);
      this.els.treeViewport.addEventListener("pointerup", this.stopViewportPan);
      this.els.treeViewport.addEventListener("pointercancel", this.stopViewportPan);
      this.els.treeViewport.addEventListener("lostpointercapture", this.stopViewportPan);
    }

    /**
     * Converts plain node data into lookup maps used by rendering and search.
     * Also records parent links and path labels for every node.
     */
    hydrateTree(data) {
      if (!data?.rootId || !Array.isArray(data.nodes)) {
        throw new Error("Plant tree data is missing or malformed.");
      }

      this.state.byId.clear();
      this.state.childrenByParent.clear();
      this.state.parentById.clear();
      this.state.searchIndex = [];
      this.state.taxonNameIndex.clear();
      this.state.taxonAliasIndex.clear();
      this.state.rootId = data.rootId;
      this.state.activeId = data.rootId;
      this.state.searchHighlightId = null;
      this.state.expanded = new Set([data.rootId]);

      for (const node of data.nodes) {
        this.state.byId.set(node.id, {
          ...node,
          children: node.children ? [...node.children] : []
        });
      }

      for (const node of this.state.byId.values()) {
        const children = node.children
          .map((childId, index) => {
            const child = this.state.byId.get(childId);
            if (child) child.treeSort = index;
            return child;
          })
          .filter(Boolean);
        this.state.childrenByParent.set(node.id, children);
        for (const child of children) this.state.parentById.set(child.id, node.id);
      }

      this.updatePaths(data.rootId, []);
      this.indexTaxonNames();
      this.state.searchIndex = Array.from(this.state.byId.values()).sort(this.utils.compareNodes);
    }

    /**
     * Recursively builds the human-readable path shown in search results and details.
     */
    updatePaths(nodeId, ancestors) {
      const node = this.state.byId.get(nodeId);
      if (!node) return;
      const nextAncestors = [...ancestors, node.name];
      node.pathString = nextAncestors.join(" / ");
      for (const child of this.getChildren(nodeId)) this.updatePaths(child.id, nextAncestors);
    }

    /**
     * Builds exact-name and alias indexes for local search and external taxon matching.
     */
    indexTaxonNames() {
      this.state.taxonNameIndex.clear();
      this.state.taxonAliasIndex.clear();
      for (const node of this.state.byId.values()) {
        this.addIndexedTaxonName(this.state.taxonNameIndex, node.name, node);
        this.addIndexedTaxonName(this.state.taxonNameIndex, node.id, node);
        for (const alias of node.searchAliases || []) {
          this.addIndexedTaxonName(this.state.taxonAliasIndex, alias, node);
        }
      }
    }

    /**
     * Adds one normalized name/alias key to a search index.
     */
    addIndexedTaxonName(index, value, node) {
      const key = this.utils.normalizeSearch(value);
      if (!key) return;
      if (!index.has(key)) index.set(key, []);
      index.get(key).push(node);
    }

    /**
     * Renders the visible tree from the current expansion state.
     */
    render() {
      const rootNode = this.state.byId.get(this.state.rootId);
      if (!rootNode) return;

      const root = document.createElement("ul");
      root.className = "tree-root";
      root.setAttribute("role", "group");
      root.append(this.renderNode(rootNode, 1));
      this.els.tree.replaceChildren(root);
      requestAnimationFrame(this.drawEdges);
    }

    /**
     * Renders one tree item and, when expanded, recursively renders its child branch.
     */
    renderNode(node, level) {
      const children = this.getChildren(node.id);
      const hasChildren = children.length > 0;
      const isExpanded = this.state.expanded.has(node.id);
      const item = this.els.nodeTemplate.content.firstElementChild.cloneNode(true);
      const nodeCard = item.querySelector(".node");
      const button = item.querySelector(".node-main");
      const infoButton = item.querySelector(".info-button");
      const name = item.querySelector(".node-name");
      const meta = item.querySelector(".node-meta");

      item.dataset.id = node.id;
      item.setAttribute("aria-level", String(level));
      item.setAttribute("aria-selected", String(this.state.activeId === node.id));
      if (hasChildren) item.setAttribute("aria-expanded", String(isExpanded));

      nodeCard.classList.toggle("is-active", this.state.activeId === node.id);
      nodeCard.classList.toggle("is-search-highlight", this.state.searchHighlightId === node.id);
      nodeCard.classList.toggle("has-children", hasChildren);
      nodeCard.classList.add(`rank-${this.rankClassName(node.rank)}`);
      nodeCard.style.setProperty("--depth", level - 1);

      button.setAttribute("aria-label", this.nodeLabel(node, isExpanded));
      infoButton.setAttribute("aria-label", `Show details about ${node.name}`);

      name.textContent = node.name;
      meta.textContent = this.nodeMeta(node, children.length);

      button.addEventListener("click", () => this.handleNodeClick(node.id));
      infoButton.addEventListener("click", () => {
        if (this.state.searchHighlightId !== node.id) this.state.searchHighlightId = null;
        this.state.activeId = node.id;
        this.render();
        window.AB.details.refreshDetails(node.id);
      });

      if (hasChildren && isExpanded) {
        const branch = document.createElement("ul");
        branch.className = "branch";
        branch.setAttribute("role", "group");
        for (const child of children) branch.append(this.renderNode(child, level + 1));
        item.append(branch);
      }

      return item;
    }

    /**
     * Handles clicks on a node body: expand/collapse branches or select leaf nodes.
     * Collapsing intentionally forgets deeper expanded descendants.
     */
    handleNodeClick(nodeId) {
      const node = this.state.byId.get(nodeId);
      if (!node) return;

      this.state.activeId = nodeId;
      this.state.searchHighlightId = null;
      if (!this.getChildren(nodeId).length) {
        this.render();
        this.afterNodeMainClick(node);
        return;
      }

      if (this.state.expanded.has(nodeId)) {
        this.collapseSubtree(nodeId);
        this.render();
        this.afterNodeMainClick(node);
      } else {
        this.state.expanded.add(nodeId);
        this.render();
        this.afterNodeMainClick(node);
        this.scrollExpandedChildrenIntoView(nodeId);
      }
    }

    /**
     * Lets page-specific experiences react to node-body clicks without forking tree rendering.
     */
    afterNodeMainClick(node) {
      if (typeof this.onNodeMainClick === "function") this.onNodeMainClick(node);
    }

    /**
     * Collapses a node and every open descendant under it.
     */
    collapseSubtree(nodeId) {
      this.state.expanded.delete(nodeId);
      for (const child of this.getChildren(nodeId)) {
        this.collapseSubtree(child.id);
      }
    }

    /**
     * Returns the tree to a controlled reset state.
     * Pass expandedIds to keep a known branch open after a game round reset.
     */
    resetView(options = {}) {
      if (!this.state.rootId) return;
      this.state.expanded = new Set([this.state.rootId, ...(options.expandedIds || [])]);
      this.state.activeId = options.activeId ?? this.state.rootId;
      this.state.searchHighlightId = null;
      this.render();
      requestAnimationFrame(() => {
        if (options.scrollToId) {
          this.scrollNodeIntoView(options.scrollToId, options.behavior || "auto");
          return;
        }

        this.els.treeViewport.scrollTo({
          left: 0,
          top: 0,
          behavior: options.behavior || "auto"
        });
      });
    }

    /**
     * Scrolls one visible node to a comfortable position in the viewport.
     */
    scrollNodeIntoView(nodeId, behavior = "smooth") {
      const nodeButton = this.els.tree.querySelector(`[data-id="${CSS.escape(nodeId)}"] .node-main`);
      nodeButton?.scrollIntoView({ behavior, block: "center", inline: "center" });
    }

    /**
     * Scrolls newly revealed children near the center of the tree viewport.
     */
    scrollExpandedChildrenIntoView(nodeId) {
      requestAnimationFrame(() => {
        const item = this.els.tree.querySelector(`[data-id="${CSS.escape(nodeId)}"]`);
        const branch = item?.querySelector(":scope > .branch");
        const target = branch || item;
        if (!target) return;

        const viewportBox = this.els.treeViewport.getBoundingClientRect();
        const targetBox = target.getBoundingClientRect();
        const targetCenterX = targetBox.left + targetBox.width / 2;
        const targetCenterY = targetBox.top + targetBox.height / 2;
        const viewportCenterX = viewportBox.left + viewportBox.width * 0.54;
        const viewportCenterY = viewportBox.top + viewportBox.height * 0.48;

        this.els.treeViewport.scrollTo({
          left: this.els.treeViewport.scrollLeft + targetCenterX - viewportCenterX,
          top: this.els.treeViewport.scrollTop + targetCenterY - viewportCenterY,
          behavior: "smooth"
        });
      });
    }

    /**
     * Opens every ancestor needed to reveal a searched node, then centers and focuses it.
     */
    revealNode(nodeId, options = {}) {
      let currentId = nodeId;
      while (this.state.parentById.has(currentId)) {
        const parentId = this.state.parentById.get(currentId);
        this.state.expanded.add(parentId);
        currentId = parentId;
      }

      if (this.getChildren(nodeId).length) this.state.expanded.add(nodeId);
      this.state.activeId = nodeId;
      this.state.searchHighlightId = options.highlight ? nodeId : null;
      this.render();

      requestAnimationFrame(() => {
        const active = this.els.tree.querySelector(`[data-id="${CSS.escape(nodeId)}"] .node-main`);
        this.scrollNodeIntoView(nodeId);
        active?.focus({ preventScroll: true });
      });
    }

    /**
     * Rebuilds the SVG curves that visually connect visible parent and child nodes.
     */
    drawEdges() {
      this.els.tree.querySelector(".tree-edges")?.remove();

      const treeBox = this.els.tree.getBoundingClientRect();
      const width = this.els.tree.scrollWidth;
      const height = this.els.tree.scrollHeight;
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.classList.add("tree-edges");
      svg.setAttribute("width", String(width));
      svg.setAttribute("height", String(height));
      svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
      svg.setAttribute("aria-hidden", "true");

      const expandedParents = this.els.tree.querySelectorAll(".tree-item[aria-expanded='true']");
      for (const parentItem of expandedParents) {
        const parentNode = parentItem.querySelector(":scope > .node");
        const childNodes = parentItem.querySelectorAll(":scope > .branch > .tree-item > .node");
        if (!parentNode || !childNodes.length) continue;

        const parentPoint = this.utils.rightCenter(parentNode, treeBox);
        for (const childNode of childNodes) {
          const childPoint = this.utils.leftCenter(childNode, treeBox);
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

      this.els.tree.prepend(svg);
    }

    /**
     * Produces the small secondary label inside a node.
     */
    nodeMeta(node, childCount) {
      if (childCount) return `${this.utils.capitalize(node.rank)} / ${this.utils.formatCount(childCount)} shown`;
      if (node.rank === "genus") return "Genus";
      return this.utils.capitalize(node.rank);
    }

    /**
     * Normalizes rank names so CSS can target stable rank classes.
     */
    rankClassName(rank) {
      return String(rank || "unknown")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") || "unknown";
    }

    /**
     * Starts drag-to-pan only when the pointer begins on tree background.
     */
    startViewportPan(event) {
      if (!this.canStartViewportPan(event)) return;
      this.viewportPan = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        scrollLeft: this.els.treeViewport.scrollLeft,
        scrollTop: this.els.treeViewport.scrollTop,
        didMove: false
      };
      this.els.treeViewport.classList.add("is-panning");
      this.els.treeViewport.setPointerCapture?.(event.pointerId);
    }

    /**
     * Moves the scroll position while background drag-to-pan is active.
     */
    updateViewportPan(event) {
      if (!this.viewportPan || event.pointerId !== this.viewportPan.pointerId) return;
      const deltaX = event.clientX - this.viewportPan.startX;
      const deltaY = event.clientY - this.viewportPan.startY;
      if (Math.abs(deltaX) + Math.abs(deltaY) > 3) this.viewportPan.didMove = true;
      if (!this.viewportPan.didMove) return;

      event.preventDefault();
      this.els.treeViewport.scrollLeft = this.viewportPan.scrollLeft - deltaX;
      this.els.treeViewport.scrollTop = this.viewportPan.scrollTop - deltaY;
    }

    /**
     * Ends an active background drag-to-pan gesture.
     */
    stopViewportPan(event) {
      if (!this.viewportPan || event.pointerId !== this.viewportPan.pointerId) return;
      if (this.els.treeViewport.hasPointerCapture?.(event.pointerId)) {
        this.els.treeViewport.releasePointerCapture(event.pointerId);
      }
      this.els.treeViewport.classList.remove("is-panning");
      this.viewportPan = null;
    }

    /**
     * Keeps node clicks and form controls from becoming drag gestures.
     */
    canStartViewportPan(event) {
      if (!event.isPrimary) return false;
      if (event.pointerType === "mouse" && event.button !== 0) return false;
      return !event.target.closest(".node, button, input, select, textarea, a");
    }

    /**
     * Produces an accessible label that includes expansion state for branch nodes.
     */
    nodeLabel(node, isExpanded) {
      const children = this.getChildren(node.id).length;
      if (!children) return `${node.name}, ${node.rank}`;
      return `${node.name}, ${node.rank}, ${children} children, ${isExpanded ? "expanded" : "collapsed"}`;
    }

  }

  window.AB.TreeView = TreeView;
  window.AB.tree = new TreeView(window.AB);
})();
