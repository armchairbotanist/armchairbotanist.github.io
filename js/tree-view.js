(function () {
  const { state, els, getChildren, utils } = window.AB;
  const {
    normalizeSearch,
    compareNodes,
    formatCount,
    capitalize,
    escapeHtml,
    rightCenter,
    leftCenter
  } = utils;

  function init() {
    window.addEventListener("resize", drawEdges);
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
    state.searchHighlightId = null;
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
    nodeCard.classList.toggle("is-search-highlight", state.searchHighlightId === node.id);
    nodeCard.classList.toggle("has-children", hasChildren);
    nodeCard.style.setProperty("--depth", level - 1);

    button.setAttribute("aria-label", nodeLabel(node, isExpanded));
    infoButton.setAttribute("aria-label", `Show details about ${node.name}`);

    name.textContent = node.name;
    meta.textContent = nodeMeta(node, children.length);

    button.addEventListener("click", () => handleNodeClick(node.id));
    infoButton.addEventListener("click", () => {
      if (state.searchHighlightId !== node.id) state.searchHighlightId = null;
      state.activeId = node.id;
      render();
      window.AB.details.refreshDetails(node.id);
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
    state.searchHighlightId = null;
    if (!getChildren(nodeId).length) {
      render();
      return;
    }

    if (state.expanded.has(nodeId)) {
      collapseSubtree(nodeId);
      render();
    } else {
      state.expanded.add(nodeId);
      render();
      scrollExpandedChildrenIntoView(nodeId);
    }
  }

  function collapseSubtree(nodeId) {
    state.expanded.delete(nodeId);
    for (const child of getChildren(nodeId)) {
      collapseSubtree(child.id);
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

  function revealNode(nodeId, options = {}) {
    let currentId = nodeId;
    while (state.parentById.has(currentId)) {
      const parentId = state.parentById.get(currentId);
      state.expanded.add(parentId);
      currentId = parentId;
    }

    if (getChildren(nodeId).length) state.expanded.add(nodeId);
    state.activeId = nodeId;
    state.searchHighlightId = options.highlight ? nodeId : null;
    render();

    requestAnimationFrame(() => {
      const active = els.tree.querySelector(`[data-id="${CSS.escape(nodeId)}"] .node-main`);
      active?.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
      active?.focus({ preventScroll: true });
    });
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

  window.AB.tree = {
    init,
    hydrateTree,
    render,
    revealNode,
    drawEdges
  };
})();
