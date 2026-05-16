(function () {
  const { state } = window.AB;

  /**
   * Starts the application after all data and controller scripts have loaded.
   * This wires controllers, builds the tree indexes, renders the first view,
   * and falls back to an on-page error if the data shape is invalid.
   */
  function init() {
    window.AB.tree.init();
    window.AB.details.init();
    window.AB.search.init();

    try {
      window.AB.tree.hydrateTree(window.PLANT_TREE_DATA);
      window.AB.tree.render();
      window.AB.details.renderSiteFooter(window.PLANT_TREE_DATA);
      window.AB.details.refreshDetails(state.rootId);
    } catch (error) {
      console.error(error);
      window.AB.details.renderLoadError(error);
    }
  }

  init();
})();
