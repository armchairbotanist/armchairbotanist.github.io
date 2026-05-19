(function () {
  const app = window.AB;
  const plants = window.DAILY_PLANTS || [];
  const game = {
    selectedFamilyId: null,
    target: null,
    mode: "daily",
    hintLevel: 0,
    answered: false
  };

  const els = {
    plantPrompt: document.querySelector("#plantPrompt"),
    selectedFamily: document.querySelector("#selectedFamily"),
    submitGuess: document.querySelector("#submitGuess"),
    hintButton: document.querySelector("#hintButton"),
    newRandomButton: document.querySelector("#newRandomButton"),
    hintBox: document.querySelector("#hintBox"),
    feedbackBox: document.querySelector("#feedbackBox")
  };

  /**
   * Starts the daily game using the shared tree and fact-pane controllers.
   */
  function init() {
    try {
      chooseChallenge();
      app.tree.init();
      app.details.init();
      app.tree.hydrateTree(window.PLANT_TREE_DATA);
      app.tree.onNodeMainClick = handleTreeNodeClick;
      app.tree.render();
      app.details.renderSiteFooter(window.PLANT_TREE_DATA);
      bindEvents();
      renderChallenge();
    } catch (error) {
      console.error(error);
      document.body.classList.remove("details-pane-hidden");
      app.details.renderLoadError(error);
    }
  }

  /**
   * Chooses either the shared daily plant or a fresh random plant.
   */
  function chooseChallenge() {
    if (!plants.length) throw new Error("Daily plant list is empty.");

    const params = new URLSearchParams(window.location.search);
    game.mode = params.get("mode") === "random" ? "random" : "daily";
    const index = game.mode === "random" ? randomIndex() : dailyIndex();
    game.target = plants[index];
  }

  /**
   * Returns a deterministic plant index for the current UTC date.
   */
  function dailyIndex() {
    const today = new Date().toISOString().slice(0, 10);
    let hash = 0;
    for (const char of today) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
    return hash % plants.length;
  }

  /**
   * Returns a weighted random plant index, favoring plants missed in random mode.
   */
  function randomIndex() {
    const stats = readRandomStats();
    const weights = plants.map((plant) => randomPlantWeight(plant, stats[plantKey(plant)]));
    const total = weights.reduce((sum, weight) => sum + weight, 0);
    let pick = Math.random() * total;

    for (let index = 0; index < weights.length; index += 1) {
      pick -= weights[index];
      if (pick <= 0) return index;
    }

    return plants.length - 1;
  }

  /**
   * Calculates how likely a plant is to appear in random mode.
   * Misses raise the weight; later correct answers gradually pull it back down.
   */
  function randomPlantWeight(plant, stats = {}) {
    const misses = Number(stats.misses || 0);
    const corrects = Number(stats.corrects || 0);
    const missWeight = app.config.dailyGame?.randomMissWeight ?? 3;
    const recovery = app.config.dailyGame?.randomCorrectRecovery ?? 1;
    const weakScore = Math.max(0, misses - corrects * recovery);
    return 1 + weakScore * missWeight;
  }

  /**
   * Registers game controls.
   */
  function bindEvents() {
    els.submitGuess.addEventListener("click", submitGuess);
    els.hintButton.addEventListener("click", showNextHint);
    els.newRandomButton.addEventListener("click", () => {
      window.location.href = `./index.html?mode=random&t=${Date.now()}`;
    });
  }

  /**
   * Writes the prompt, mode state, and initial control state.
   */
  function renderChallenge() {
    const targetFamily = app.state.byId.get(game.target.targetFamilyId);
    els.plantPrompt.textContent = displayPlantName(game.target.commonName);
    game.selectedFamilyId = null;
    game.answered = false;
    els.selectedFamily.textContent = "Pick family";
    els.submitGuess.disabled = true;
    els.hintBox.hidden = true;
    els.feedbackBox.hidden = true;
    if (!targetFamily) throw new Error(`Missing target family: ${game.target.targetFamilyId}`);
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
    app.state.searchHighlightId = node.id;
    els.selectedFamily.textContent = node.name;
    els.submitGuess.disabled = false;
    els.feedbackBox.hidden = true;
    app.tree.render();
  }

  /**
   * Shows progressively more specific hints for the current challenge.
   */
  function showNextHint() {
    const targetPath = pathToRoot(game.target.targetFamilyId);
    const order = [...targetPath].reverse().find((node) => node.rank === "order");
    const major = targetPath.find((node) => ["Monocots", "Magnoliids", "Rosids", "Asterids"].includes(node.name));
    const hints = [
      major ? `Major group: ${major.name}` : `High-level group: ${targetPath[0]?.name || "Land plants"}`,
      order ? `Order: ${order.name}` : "The target is a family in the visible tree.",
      `Scientific name clue: ${game.target.scientificName}`
    ];
    els.hintBox.hidden = false;
    els.hintBox.textContent = hints[Math.min(game.hintLevel, hints.length - 1)];
    game.hintLevel += 1;
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
    recordRandomResult(isCorrect);
    app.tree.revealNode(target.id, { highlight: true });
    app.details.refreshDetails(target.id);
  }

  /**
   * Records one random-mode result so future random prompts favor weak plants.
   */
  function recordRandomResult(isCorrect) {
    if (game.mode !== "random") return;

    const key = plantKey(game.target);
    const stats = readRandomStats();
    const entry = stats[key] || {
      commonName: game.target.commonName,
      targetFamilyId: game.target.targetFamilyId,
      attempts: 0,
      misses: 0,
      corrects: 0
    };

    entry.attempts += 1;
    entry.corrects += isCorrect ? 1 : 0;
    entry.misses += isCorrect ? 0 : 1;
    entry.lastResult = isCorrect ? "correct" : "miss";
    entry.updatedAt = new Date().toISOString();
    stats[key] = entry;
    writeRandomStats(stats);
  }

  /**
   * Builds a stable key for a daily-game plant.
   */
  function plantKey(plant) {
    return app.utils.normalizeSearch(plant.commonName || plant.scientificName || plant.targetFamilyId);
  }

  /**
   * Returns the version-scoped storage key for random-mode performance.
   */
  function randomStatsStorageKey() {
    const version = window.PLANT_TREE_DATA?.siteVersion || app.config.fallbackSiteVersion || "unknown";
    return `${app.config.storagePrefix}:${version}:daily-random-performance`;
  }

  /**
   * Reads random-mode performance data, tolerating unavailable or stale storage.
   */
  function readRandomStats() {
    try {
      const parsed = JSON.parse(window.localStorage.getItem(randomStatsStorageKey()) || "{}");
      return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
    } catch (_error) {
      return {};
    }
  }

  /**
   * Persists random-mode performance data when browser storage is available.
   */
  function writeRandomStats(stats) {
    try {
      window.localStorage.setItem(randomStatsStorageKey(), JSON.stringify(stats));
    } catch (_error) {
      // Private browsing or storage limits should not block the game.
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
