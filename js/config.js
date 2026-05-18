(function () {
  window.AB_CONFIG = {
    fallbackSiteVersion: "2.03",
    storagePrefix: "armchair-botanist",

    media: {
      detailsPaneDesktop: "(min-width: 761px)"
    },

    detailsPane: {
      desktop: {
        minPx: 340,
        maxPx: 760,
        minTreePx: 260,
        compactMinPx: 300,
        compactTreePx: 280,
        keyboardStepPx: 24,
        keyboardLargeStepPx: 48
      },
      mobile: {
        minPx: 210,
        maxTreePx: 130,
        minRatio: 0.32,
        maxRatio: 0.72,
        compactMaxPx: 300,
        keyboardStepPx: 24,
        keyboardLargeStepPx: 48
      }
    },

    search: {
      debounceMs: 260,
      maxResults: 12,
      minTaxonQueryLength: 3,
      plantAncestorTaxonId: 47126,
      taxonAutocompleteLimit: 8,
      ancestorLimit: 12
    },

    photos: {
      maxPhotos: 6,
      taxonAutocompleteLimit: 8,
      qualityGrade: "research",
      orderBy: "votes"
    }
  };
})();
