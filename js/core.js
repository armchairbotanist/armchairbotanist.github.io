(function () {
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
    searchHighlightId: null,
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

  function getChildren(nodeId) {
    return state.childrenByParent.get(nodeId) || [];
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

  window.AB = {
    state,
    els,
    getChildren,
    utils: {
      normalizeSearch,
      limitSentences,
      compareNodes,
      rankWeight,
      rightCenter,
      leftCenter,
      formatCount,
      capitalize,
      escapeHtml
    }
  };
})();
