(function () {
  const config = window.AB_CONFIG || {};

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
    appShell: document.querySelector(".app-shell"),
    treeViewport: document.querySelector("#treeViewport"),
    tree: document.querySelector("#tree"),
    searchInput: document.querySelector("#searchInput"),
    clearSearch: document.querySelector("#clearSearch"),
    searchResults: document.querySelector("#searchResults"),
    nodeTemplate: document.querySelector("#nodeTemplate"),
    detailsPanel: document.querySelector("#detailsPanel"),
    detailsResizeHandle: document.querySelector("#detailsResizeHandle"),
    detailsContent: document.querySelector("#detailsContent"),
    siteFooter: document.querySelector("#siteFooter"),
    imageViewer: document.querySelector("#imageViewer"),
    imageViewerClose: document.querySelector("#imageViewerClose"),
    imageViewerImg: document.querySelector("#imageViewerImg"),
    imageViewerCaption: document.querySelector("#imageViewerCaption")
  };

  /**
   * Returns hydrated child node objects for a node id.
   * Missing or leaf nodes intentionally return an empty array.
   */
  function getChildren(nodeId) {
    return state.childrenByParent.get(nodeId) || [];
  }

  /**
   * Converts labels, ids, and aliases into comparable search keys.
   * The normalization removes accents and punctuation so loose user input still matches.
   */
  function normalizeSearch(value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  }

  /**
   * Keeps external summary text short enough for the fact pane.
   * Falls back to the original text when sentence boundaries are not obvious.
   */
  function limitSentences(text, limit) {
    const sentences = String(text || "").match(/[^.!?]+[.!?]+/g);
    if (!sentences) return String(text || "");
    return sentences.slice(0, limit).join(" ").trim();
  }

  /**
   * Sorts nodes in tree order when that order is known, otherwise by rank and name.
   * Used for predictable search result ordering.
   */
  function compareNodes(a, b) {
    if (Number.isFinite(a.treeSort) || Number.isFinite(b.treeSort)) {
      return (a.treeSort ?? 9999) - (b.treeSort ?? 9999);
    }
    return rankWeight(a.rank) - rankWeight(b.rank) || a.name.localeCompare(b.name);
  }

  /**
   * Assigns broad display/search precedence to each taxonomic rank.
   */
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

  /**
   * Computes the right-middle connection point of an element relative to the tree canvas.
   */
  function rightCenter(element, treeBox) {
    const box = element.getBoundingClientRect();
    return {
      x: box.right - treeBox.left,
      y: box.top + box.height / 2 - treeBox.top
    };
  }

  /**
   * Computes the left-middle connection point of an element relative to the tree canvas.
   */
  function leftCenter(element, treeBox) {
    const box = element.getBoundingClientRect();
    return {
      x: box.left - treeBox.left,
      y: box.top + box.height / 2 - treeBox.top
    };
  }

  /**
   * Formats child counts in node labels.
   */
  function formatCount(value) {
    return Number(value || 0).toLocaleString();
  }

  /**
   * Capitalizes a short rank or label without changing the rest of the text.
   */
  function capitalize(value) {
    const clean = String(value || "");
    return clean.charAt(0).toUpperCase() + clean.slice(1);
  }

  /**
   * Resolves project-relative asset paths from shared data against the app root.
   * This keeps figure URLs correct from nested pages such as /game/.
   */
  function resolveAssetUrl(value) {
    const raw = String(value || "").trim();
    if (!raw) return "";
    if (/^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(raw)) return raw;
    if (raw.startsWith("/")) return raw;
    return new URL(raw, config.appBaseUrl || new URL("./", window.location.href)).toString();
  }

  /**
   * Escapes text before it is inserted into an HTML string.
   */
  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  window.AB = {
    config,
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
      resolveAssetUrl,
      escapeHtml
    }
  };
})();
