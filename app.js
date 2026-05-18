(function () {
  /**
   * Starts the application after all data and controller scripts have loaded.
   * This wires controllers, builds the tree indexes, renders the first view,
   * and leaves the fact pane closed until a node's info button is clicked.
   */
  function init() {
    window.AB.tree.init();
    window.AB.details.init();
    window.AB.search.init();

    try {
      window.AB.tree.hydrateTree(window.PLANT_TREE_DATA);
      window.AB.tree.render();
      window.AB.details.renderSiteFooter(window.PLANT_TREE_DATA);
    } catch (error) {
      console.error(error);
      document.body.classList.remove("details-pane-hidden");
      window.AB.details.renderLoadError(error);
    }
  }

  init();
})();
