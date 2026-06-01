(function () {
  const scriptUrl = document.currentScript?.src || "";
  const appBaseUrl = scriptUrl
    ? new URL("../", scriptUrl).toString()
    : new URL("./", window.location.href).toString();

  window.AB_CONFIG = {
    fallbackSiteVersion: "2.39",
    appBaseUrl,
    storagePrefix: "armchair-botanist",

    media: {
      detailsPaneDesktop: "(min-width: 761px)"
    },

    detailsPane: {
      desktop: {
        minPx: 220,
        maxPx: 760,
        minTreePx: 260,
        compactMinPx: 220,
        compactTreePx: 280,
        keyboardStepPx: 24,
        keyboardLargeStepPx: 48
      },
      mobile: {
        minPx: 128,
        maxTreePx: 130,
        minRatio: 0.18,
        maxRatio: 0.72,
        compactMaxPx: 180,
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
