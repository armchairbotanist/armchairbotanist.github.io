(function () {
  const { state } = window.AB;

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
