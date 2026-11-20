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
