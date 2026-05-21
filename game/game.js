(function () {
  const app = window.AB;
  const ALL_LEVELS_ID = "all";
  const GAME_START_BRANCH_IDS = [
    "bryophyte-grade",
    "lycophytes",
    "ferns",
    "gymnosperms",
    "angiosperms"
  ];
  const levels = normalizeLevelData(window.PLANT_GAME_LEVELS || [], window.PLANT_GAME_PLANTS || []);
  const game = {
    levelId: null,
    pool: [],
    index: 0,
    selectedFamilyId: null,
    target: null,
    hintLevel: 0,
    answered: false
  };

  const els = {
    plantPrompt: document.querySelector("#plantPrompt"),
    selectedFamily: document.querySelector("#selectedFamily"),
    progressLabel: document.querySelector("#progressLabel"),
    submitGuess: document.querySelector("#submitGuess"),
    hintButton: document.querySelector("#hintButton"),
    nextPlantButton: document.querySelector("#nextPlantButton"),
    levelSelect: document.querySelector("#levelSelect"),
    hintBox: document.querySelector("#hintBox"),
    feedbackBox: document.querySelector("#feedbackBox")
  };

  /**
   * Starts the level-based family guessing game.
   */
  function init() {
    try {
      app.tree.init();
      app.details.init();
      app.tree.hydrateTree(window.PLANT_TREE_DATA);
      app.tree.onNodeMainClick = handleTreeNodeClick;
      app.tree.render();
      app.details.renderSiteFooter(window.PLANT_TREE_DATA);
      bindEvents();
      setLevel(resolveInitialLevel());
      showPlantAt(0);
    } catch (error) {
      console.error(error);
      document.body.classList.remove("details-pane-hidden");
      app.details.renderLoadError(error);
    }
  }

  /**
   * Converts the configured level data into a predictable internal shape.
   */
  function normalizeLevelData(rawLevels, fallbackPlants) {
    if (Array.isArray(rawLevels) && rawLevels.length) {
      return rawLevels
        .filter((level) => level && Array.isArray(level.plants))
        .map((level, index) => {
          const id = String(level.id || index + 1);
          return {
            id,
            name: String(level.name || `Level ${id}`),
            plants: level.plants.map((plant) => ({ ...plant, level: id }))
          };
        });
    }

    if (Array.isArray(fallbackPlants) && fallbackPlants.length) {
      return [
        {
          id: "1",
          name: "Level 1",
          plants: fallbackPlants.map((plant) => ({ ...plant, level: "1" }))
        }
      ];
    }

    return [];
  }

  /**
   * Registers level, scoring, hint, and next-plant controls.
   */
  function bindEvents() {
    els.submitGuess.addEventListener("click", submitGuess);
    els.hintButton.addEventListener("click", showNextHint);
    els.nextPlantButton.addEventListener("click", showNextPlant);
    els.levelSelect.addEventListener("change", () => {
      setLevel(els.levelSelect.value);
      updateLevelUrl();
      showPlantAt(0);
    });
  }

  /**
   * Applies a level selection and persists it for the next visit.
   */
  function setLevel(levelId) {
    game.levelId = isValidLevelId(levelId) ? levelId : defaultLevelId();
    game.pool = plantsForLevel(game.levelId);
    if (!game.pool.length) throw new Error("Plant game level is empty.");
    writeSelectedLevel(game.levelId);
    renderLevelSelect();
  }

  /**
   * Returns the first configured level as the default level.
   */
  function defaultLevelId() {
    return levels[0]?.id || ALL_LEVELS_ID;
  }

  /**
   * Finds the starting level from the URL, local storage, or default level.
   */
  function resolveInitialLevel() {
    const params = new URLSearchParams(window.location.search);
    const requested = params.get("level");
    if (isValidLevelId(requested)) return requested;

    const stored = readSelectedLevel();
    if (isValidLevelId(stored)) return stored;

    return defaultLevelId();
  }

  /**
   * Checks whether a level id can be selected.
   */
  function isValidLevelId(levelId) {
    if (!levelId) return false;
    if (levelId === ALL_LEVELS_ID) return true;
    return levels.some((level) => level.id === levelId);
  }

  /**
   * Returns the plant pool for one level, or every plant for All.
   */
  function plantsForLevel(levelId) {
    if (levelId === ALL_LEVELS_ID) return levels.flatMap((level) => level.plants);
    return levels.find((level) => level.id === levelId)?.plants || [];
  }

  /**
   * Renders the compact level selector.
   */
  function renderLevelSelect() {
    const options = [
      ...levels.map((level) => ({ id: level.id, name: level.name })),
      { id: ALL_LEVELS_ID, name: "All" }
    ];

    els.levelSelect.innerHTML = options
      .map((option) => `<option value="${escapeHtml(option.id)}">${escapeHtml(option.name)}</option>`)
      .join("");
    els.levelSelect.value = game.levelId;
  }

  /**
   * Keeps the current level in the URL without reloading the page.
   */
  function updateLevelUrl() {
    const url = new URL(window.location.href);
    if (game.levelId === defaultLevelId()) {
      url.searchParams.delete("level");
    } else {
      url.searchParams.set("level", game.levelId);
    }
    window.history.replaceState(null, "", url);
  }

  /**
   * Advances to the next plant in the active level, wrapping at the end.
   */
  function showNextPlant() {
    showPlantAt((game.index + 1) % game.pool.length);
  }

  /**
   * Shows one plant from the active level and resets round-only state.
   */
  function showPlantAt(index) {
    game.index = clampIndex(index);
    game.target = game.pool[game.index];
    game.selectedFamilyId = null;
    game.hintLevel = 0;
    game.answered = false;
    app.state.searchHighlightId = null;
    document.body.classList.add("details-pane-hidden");
    resetTreeForTarget();
    renderChallenge();
  }

  /**
   * Resets the game tree to the broad branch that contains the current plant.
   */
  function resetTreeForTarget() {
    const startBranchId = startBranchIdForTarget(game.target?.targetFamilyId);
    const expandedIds = expandedIdsForBranch(startBranchId);
    app.tree.resetView({
      behavior: "auto",
      activeId: startBranchId || app.state.rootId,
      expandedIds,
      scrollToId: startBranchId
    });
  }

  /**
   * Finds the familiar high-level branch for a target family path.
   */
  function startBranchIdForTarget(targetId) {
    const targetPath = pathToRoot(targetId);
    return targetPath.find((node) => GAME_START_BRANCH_IDS.includes(node.id))?.id || app.state.rootId;
  }

  /**
   * Opens the full path to the high-level start branch, plus the branch itself.
   */
  function expandedIdsForBranch(branchId) {
    return pathToRoot(branchId).map((node) => node.id);
  }

  /**
   * Keeps a requested index inside the current level's plant list.
   */
  function clampIndex(index) {
    if (!game.pool.length) return 0;
    const numeric = Number(index);
    if (!Number.isFinite(numeric)) return 0;
    return Math.max(0, Math.min(game.pool.length - 1, Math.trunc(numeric)));
  }

  /**
   * Writes the prompt and initial control state for the current plant.
   */
  function renderChallenge() {
    const targetFamily = app.state.byId.get(game.target.targetFamilyId);
    if (!targetFamily) throw new Error(`Missing target family: ${game.target.targetFamilyId}`);

    els.plantPrompt.textContent = displayPlantName(game.target.commonName);
    els.selectedFamily.textContent = "Pick family";
    els.progressLabel.textContent = `${game.index + 1}/${game.pool.length}`;
    els.submitGuess.disabled = true;
    els.hintBox.hidden = true;
    els.feedbackBox.hidden = true;
    els.feedbackBox.classList.remove("is-correct", "is-wrong");
  }

  /**
   * Formats a plant prompt as a compact title without changing the data value.
   */
  function displayPlantName(value) {
    return String(value || "")
      .split(" ")
      .map((word) => app.utils.capitalize(word))
      .join(" ");
  }

  /**
   * Selects family nodes clicked in the shared tree as game guesses.
   */
  function handleTreeNodeClick(node) {
    if (node.rank !== "family") return;
    if (game.answered) return;

    game.selectedFamilyId = node.id;
    app.state.searchHighlightId = null;
    els.selectedFamily.textContent = node.name;
    els.submitGuess.disabled = false;
    els.feedbackBox.hidden = true;
    app.tree.render();
  }

  /**
   * Shows progressively more specific hints for the current plant.
   */
  function showNextHint() {
    const targetPath = pathToRoot(game.target.targetFamilyId);
    const hintPath = hintPathFromTargetPath(targetPath);
    const pathHints = hintPath.map((node, index) => {
      const path = hintPath.slice(0, index + 1);
      return `${app.utils.capitalize(node.rank)}: ${formatPath(path)}`;
    });
    const hints = [
      ...pathHints,
      ...scientificNameHints(game.target.scientificName)
    ];
    els.hintBox.hidden = false;
    els.hintBox.textContent = hints[Math.min(game.hintLevel, hints.length - 1)];
    game.hintLevel += 1;
  }

  /**
   * Converts the target scientific name into genus and species-level hints when possible.
   */
  function scientificNameHints(scientificName) {
    const cleanName = String(scientificName || "").trim().replace(/\s+/g, " ");
    if (!cleanName) return [];

    const parts = cleanName.split(" ");
    if (parts.length === 1) {
      const rank = cleanName.endsWith("aceae") ? "Target taxon" : "Genus";
      return [`${rank}: ${cleanName}`];
    }

    const genus = parts[0];
    const species = parts.slice(0, 2).join(" ");
    const hints = [`Genus: ${genus}`, `Species: ${species}`];
    if (parts.length > 2) hints.push(`Scientific name: ${cleanName}`);
    return hints;
  }

  /**
   * Builds the hint path, starting angiosperm targets just below Angiosperms.
   */
  function hintPathFromTargetPath(targetPath) {
    const angiospermIndex = targetPath.findIndex((node) => node.id === "angiosperms" || node.name === "Angiosperms");
    if (angiospermIndex >= 0 && angiospermIndex < targetPath.length - 1) {
      return targetPath.slice(angiospermIndex + 1);
    }
    return targetPath;
  }

  /**
   * Scores the selected family and reveals the correct family in the shared tree.
   */
  function submitGuess() {
    if (!game.selectedFamilyId || game.answered) return;

    const selected = app.state.byId.get(game.selectedFamilyId);
    const target = app.state.byId.get(game.target.targetFamilyId);
    const selectedPath = pathToRoot(game.selectedFamilyId);
    const targetPath = pathToRoot(game.target.targetFamilyId);
    const commonAncestor = deepestSharedNode(selectedPath, targetPath);
    const isCorrect = selected.id === target.id;
    const plantName = displayPlantName(game.target.commonName);

    els.feedbackBox.hidden = false;
    els.feedbackBox.classList.toggle("is-correct", isCorrect);
    els.feedbackBox.classList.toggle("is-wrong", !isCorrect);
    els.feedbackBox.innerHTML = isCorrect
      ? `<strong>Correct.</strong> ${escapeHtml(plantName)} is in ${escapeHtml(target.name)}.<br>${escapeHtml(formatPath(targetPath))}`
      : `<strong>Not quite.</strong> You chose ${escapeHtml(selected.name)}. Closest shared branch: ${escapeHtml(commonAncestor.name)}.<br>Answer: ${escapeHtml(formatPath(targetPath))}`;

    game.answered = true;
    els.submitGuess.disabled = true;
    app.tree.revealNode(target.id, { highlight: true });
    app.details.refreshDetails(target.id);
  }

  /**
   * Returns the storage key for the selected level.
   */
  function selectedLevelStorageKey() {
    return `${app.config.storagePrefix}:plant-game-level`;
  }

  /**
   * Reads the selected level from browser storage.
   */
  function readSelectedLevel() {
    try {
      return window.localStorage.getItem(selectedLevelStorageKey());
    } catch (_error) {
      return null;
    }
  }

  /**
   * Persists the selected level when browser storage is available.
   */
  function writeSelectedLevel(levelId) {
    try {
      window.localStorage.setItem(selectedLevelStorageKey(), levelId);
    } catch (_error) {
      // The level selector still works when storage is unavailable.
    }
  }

  /**
   * Finds the deepest shared ancestor between two root-to-node paths.
   */
  function deepestSharedNode(pathA, pathB) {
    let shared = pathA[0];
    const length = Math.min(pathA.length, pathB.length);
    for (let index = 0; index < length; index += 1) {
      if (pathA[index].id !== pathB[index].id) break;
      shared = pathA[index];
    }
    return shared;
  }

  /**
   * Returns a root-to-node path for display and scoring.
   */
  function pathToRoot(nodeId) {
    const path = [];
    let current = app.state.byId.get(nodeId);
    while (current) {
      path.unshift(current);
      current = app.state.byId.get(app.state.parentById.get(current.id));
    }
    return path;
  }

  /**
   * Formats a path as readable text for feedback.
   */
  function formatPath(path) {
    return path.map((node) => node.name).join(" / ");
  }

  /**
   * Escapes feedback text before writing it as HTML.
   */
  function escapeHtml(value) {
    return app.utils.escapeHtml(value);
  }

  init();
})();
