// @ts-nocheck

// Global State
let rightQuestions = 0;
let currentQuestion = 0;
let currentCategory = [];
let canAnswer = true;
const HIGHSCORE_STORAGE_KEY = "quizHighscores";
let activeCategoryKey = "all";
const CATEGORY_ORDER = ["all", "movies", "games", "austria", "frontend"];

// Audio Objects
const audioSuccess = new Audio("sounds/right.mp3");
const audioFail = new Audio("sounds/wrong.mp3");

// Initialization
function init() {
  currentCategory = questions;
  updateQuizView();
}

// Category Filtering
function filterCategory(category, event, element) {
  event.preventDefault();
  updateCategorySelectionUI(element);
  applyCategoryFilter(category);
  restartGame();
}

function updateCategorySelectionUI(activeElement) {
  const links = document.querySelectorAll(".category-sidebar .list-group-item");
  links.forEach((link) => link.classList.remove("active"));
  activeElement.classList.add("active");
}

function applyCategoryFilter(category) {
  activeCategoryKey = category;
  if (category === "all") {
    currentCategory = questions;
  } else {
    currentCategory = questions.filter(
      (question) => question.category === category,
    );
  }
}

// Quiz View & Screen Management
function updateQuizView() {
  setElementText("all-questions", currentCategory.length);
  showQuestion();
}

function showQuestion() {
  if (gameIsOver()) {
    showEndscreen();
  } else {
    updateProgressbar();
    renderQuestionData();
  }
}

function gameIsOver() {
  return currentQuestion >= currentCategory.length;
}

function renderQuestionData() {
  toggleScreenVisibility(false);
  const question = currentCategory[currentQuestion];
  setElementText("question-number", currentQuestion + 1);
  setElementText("questiontext", question.question);
  renderAnswerTexts(question);
}

function renderAnswerTexts(question) {
  for (let answerIndex = 1; answerIndex <= 4; answerIndex++) {
    setElementText(`answer_${answerIndex}`, question[`answer_${answerIndex}`]);
  }
}

function toggleScreenVisibility(isGameOver) {
  const endscreen = document.getElementById("endscreen");
  const questionBody = document.getElementById("question-body");

  endscreen.style.display = isGameOver ? "" : "none";
  questionBody.style.display = isGameOver ? "none" : "";
}

function updateProgressbar() {
  const percent = Math.round((currentQuestion / currentCategory.length) * 100);
  setProgressbar(percent);
}

function setProgressbar(percent) {
  const progressBar = document.getElementById("progress-bar");
  progressBar.textContent = `${percent}%`;
  progressBar.style.width = `${percent}%`;
  progressBar.parentElement.setAttribute("aria-valuenow", percent);
}

function showEndscreen() {
  toggleScreenVisibility(true);
  setProgressbar(100);
  setElementText("amount-of-questions", currentCategory.length);
  setElementText("score", rightQuestions);
  const result = updateHighscore(activeCategoryKey, rightQuestions);
  renderHighscore(result.bestScore, result.isNewRecord);
}

// Answer Logic & Interaction Lock
function answer(selection) {
  if (!canAnswer) return;
  lockAnswers();
  evaluateSelection(selection);
  setNextButtonState(false);
}

function lockAnswers() {
  canAnswer = false;
  setAnswerButtonsDisabled(true);
}

function evaluateSelection(selection) {
  const question = currentCategory[currentQuestion];
  const selectedNumber = Number(selection.slice(-1));
  const rightAnswer = question["right-answer"];

  if (selectedNumber === rightAnswer) {
    handleCorrectAnswer(selection);
  } else {
    handleWrongAnswer(selection, rightAnswer);
  }
}

function handleCorrectAnswer(selection) {
  highlightAnswerButton(selection, "bg-success");
  playSound(audioSuccess);
  rightQuestions++;
}

function handleWrongAnswer(selection, rightAnswer) {
  highlightAnswerButton(selection, "bg-danger");
  highlightAnswerButton(`answer_${rightAnswer}`, "bg-success");
  playSound(audioFail);
}

function highlightAnswerButton(elementId, cssClass) {
  document.getElementById(elementId).classList.add(cssClass);
}

function setAnswerButtonsDisabled(isDisabled) {
  for (let answerIndex = 1; answerIndex <= 4; answerIndex++) {
    document.getElementById(`answer_${answerIndex}`).disabled = isDisabled;
  }
}

function playSound(audioObject) {
  audioObject.currentTime = 0;
  audioObject.play();
}

// Game Navigation & Resets
function nextQuestion() {
  currentQuestion++;
  setNextButtonState(true);
  resetAnswerButtons();
  showQuestion();
}

function resetAnswerButtons() {
  canAnswer = true;
  for (let answerIndex = 1; answerIndex <= 4; answerIndex++) {
    const button = document.getElementById(`answer_${answerIndex}`);
    button.classList.remove("bg-success", "bg-danger");
    button.disabled = false;
  }
}

function restartGame() {
  rightQuestions = 0;
  currentQuestion = 0;
  toggleNewHighscoreBadge(false);
  resetAnswerButtons();
  setNextButtonState(true);
  updateQuizView();
}

// Utility Functions
function setNextButtonState(isDisabled) {
  document.getElementById("next-button").disabled = isDisabled;
}

function setElementText(elementId, text) {
  document.getElementById(elementId).textContent = text;
}

// Highscore
function loadHighscores() {
  const rawData = localStorage.getItem(HIGHSCORE_STORAGE_KEY);
  if (!rawData) {
    return {};
  }
  try {
    return JSON.parse(rawData);
  } catch (error) {
    return {};
  }
}

function saveHighscores(highscores) {
  localStorage.setItem(HIGHSCORE_STORAGE_KEY, JSON.stringify(highscores));
}

function updateHighscore(categoryKey, score) {
  const highscores = loadHighscores();
  const previousBest = highscores[categoryKey] || 0;
  const isNewRecord = score > previousBest && score > 0;
  const bestScore = Math.max(previousBest, score);

  highscores[categoryKey] = bestScore;
  saveHighscores(highscores);
  return { bestScore: bestScore, isNewRecord: isNewRecord };
}

function toggleNewHighscoreBadge(isNewRecord) {
  const badge = document.getElementById("new-highscore-badge");
  badge.classList.toggle("d-none", !isNewRecord);
}

function formatCategoryLabel(categoryKey) {
  if (categoryKey === "all") {
    return "All Categories";
  }
  return categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1);
}

function renderHighscore(bestScore, isNewRecord) {
  setElementText("highscore-category", formatCategoryLabel(activeCategoryKey));
  setElementText("highscore", bestScore);
  setElementText("highscore-total", currentCategory.length);
  toggleNewHighscoreBadge(isNewRecord);
}

function getCategoryKeys() {
  const keys = new Set(CATEGORY_ORDER);
  for (let i = 0; i < questions.length; i++) {
    keys.add(questions[i].category);
  }
  return Array.from(keys);
}

function getCategoryQuestionCount(categoryKey) {
  if (categoryKey === "all") {
    return questions.length;
  }
  let count = 0;
  for (let i = 0; i < questions.length; i++) {
    if (questions[i].category === categoryKey) {
      count++;
    }
  }
  return count;
}

function buildHighscoreListItem(categoryKey, score, total) {
  const item = document.createElement("li");
  item.className =
    "list-group-item d-flex justify-content-between align-items-center";

  const label = document.createElement("span");
  label.textContent = formatCategoryLabel(categoryKey);

  const badge = document.createElement("span");
  badge.className = "badge text-bg-primary rounded-pill";
  badge.textContent = `${score} / ${total}`;

  item.appendChild(label);
  item.appendChild(badge);
  return item;
}

function renderAllHighscores() {
  const list = document.getElementById("all-highscores-list");
  list.textContent = "";
  const highscores = loadHighscores();
  const categories = getCategoryKeys();

  for (let i = 0; i < categories.length; i++) {
    const key = categories[i];
    const score = highscores[key] || 0;
    const total = getCategoryQuestionCount(key);
    list.appendChild(buildHighscoreListItem(key, score, total));
  }
}

function openHighscoresModal() {
  renderAllHighscores();
  const modalElement = document.getElementById("highscoresModal");
  const modalInstance = bootstrap.Modal.getOrCreateInstance(modalElement);
  modalInstance.show();
}
