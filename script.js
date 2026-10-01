// @ts-nocheck
// Global State
let rightQuestions = 0;
let currentQuestion = 0;
let currentCategory = [];
let canAnswer = true;

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
  if (category === "all") {
    currentCategory = questions;
  } else {
    currentCategory = questions.filter((q) => q.category === category);
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
  setElementText("questiontext", question["question"]);
  renderAnswerTexts(question);
}

function renderAnswerTexts(question) {
  for (let i = 1; i <= 4; i++) {
    setElementText(`answer_${i}`, question[`answer_${i}`]);
  }
}

function toggleScreenVisibility(isGameOver) {
  const endscreen = document.getElementById("endscreen");
  const questionBody = document.getElementById("question-body");

  endscreen.style.display = isGameOver ? "" : "none";
  questionBody.style.display = isGameOver ? "none" : "";
}

function showEndscreen() {
  toggleScreenVisibility(true);
  setElementText("amount-of-questions", currentCategory.length);
  setElementText("score", rightQuestions);
}

function updateProgressbar() {
  const percent = Math.round(
    ((currentQuestion + 1) / currentCategory.length) * 100,
  );
  const progressBar = document.getElementById("progress-bar");
  progressBar.innerHTML = `${percent}%`;
  progressBar.style.width = `${percent}%`;
}

// Answer Logic & Interaction Lock
function answer(selection) {
  if (!canAnswer) return;
  canAnswer = false;
  disableAnswerButtons();

  const question = currentCategory[currentQuestion];
  const selectedNumber = selection.slice(-1);
  const isCorrect = rightAnswerSelected(
    selectedNumber,
    question["right-answer"],
  );

  if (isCorrect) {
    handleCorrectAnswer(selection);
  } else {
    handleWrongAnswer(selection, question["right-answer"]);
  }
  document.getElementById("next-button").disabled = false;
}

function rightAnswerSelected(selectedNumber, rightAnswer) {
  return selectedNumber == rightAnswer;
}

function handleCorrectAnswer(selection) {
  highlightAnswerCard(selection, "bg-success");
  playSound(audioSuccess);
  rightQuestions++;
}

function handleWrongAnswer(selection, rightAnswer) {
  highlightAnswerCard(selection, "bg-danger");
  highlightAnswerCard(`answer_${rightAnswer}`, "bg-success");
  playSound(audioFail);
}

function highlightAnswerCard(elementId, cssClass) {
  document.getElementById(elementId).parentNode.classList.add(cssClass);
}

function disableAnswerButtons() {
  for (let i = 1; i <= 4; i++) {
    const card = document.getElementById(`answer_${i}`).parentNode;
    card.style.pointerEvents = "none";
  }
}

function playSound(audioObject) {
  audioObject.currentTime = 0;
  audioObject.play();
}

// Game Navigation & Resets
function nextQuestion() {
  currentQuestion++;
  document.getElementById("next-button").disabled = true;
  resetAnswerButtons();
  showQuestion();
}

function resetAnswerButtons() {
  canAnswer = true;
  for (let i = 1; i <= 4; i++) {
    const card = document.getElementById(`answer_${i}`).parentNode;
    card.classList.remove("bg-success", "bg-danger");
    card.style.pointerEvents = "auto";
  }
}

function restartGame() {
  rightQuestions = 0;
  currentQuestion = 0;
  resetAnswerButtons();
  document.getElementById("next-button").disabled = true;
  updateQuizView();
}

// Utility Function
function setElementText(elementId, text) {
  document.getElementById(elementId).innerHTML = text;
}
