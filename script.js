// @ts-nocheck
let rightQuestions = 0;
let currentQuestion = 0;
let currentCategory = [];
let audioSuccess = new Audio("sounds/right.mp3");
let audioFail = new Audio("sounds/wrong.mp3");

function init() {
  currentCategory = questions;
  updateQuizView();
}

function filterCategory(category, event, element) {
  event.preventDefault(); // Verhindert das Neuladen/Springen der Seite

  // Active-Status der Buttons umschalten
  let links = document.querySelectorAll(".category-sidebar .list-group-item");
  links.forEach((link) => link.classList.remove("active"));
  element.classList.add("active");

  // Array filtern
  if (category === "all") {
    currentCategory = questions;
  } else {
    currentCategory = questions.filter((q) => q.category === category);
  }

  // Quiz mit den gefilterten Fragen neu starten
  restartGame();
}

function updateQuizView() {
  document.getElementById("all-questions").innerHTML = currentCategory.length;
  showQuestion();
}

function showQuestion() {
  if (currentQuestion >= currentCategory.length) {
    document.getElementById("endscreen").style = "";
    document.getElementById("question-body").style = "display: none;";
    document.getElementById("amount-of-questions").innerHTML =
      currentCategory.length;
    document.getElementById("score").innerHTML = rightQuestions;
  } else {
    document.getElementById("endscreen").style = "display: none;";
    document.getElementById("question-body").style = "";

    let percent = (currentQuestion + 1) / currentCategory.length;
    percent = Math.round(percent * 100);

    document.getElementById("progress-bar").innerHTML = `${percent}%`;
    document.getElementById("progress-bar").style = `width: ${percent}%`;

    let question = currentCategory[currentQuestion];

    document.getElementById("question-number").innerHTML = currentQuestion + 1;
    document.getElementById("questiontext").innerHTML = question["question"];
    document.getElementById("answer_1").innerHTML = question["answer_1"];
    document.getElementById("answer_2").innerHTML = question["answer_2"];
    document.getElementById("answer_3").innerHTML = question["answer_3"];
    document.getElementById("answer_4").innerHTML = question["answer_4"];
  }
}

function answer(selection) {
  let question = currentCategory[currentQuestion];
  let selectedQuestionNumber = selection.slice(-1);
  let idOfRightAnswer = `answer_${question["right-answer"]}`;

  if (selectedQuestionNumber == question["right-answer"]) {
    document.getElementById(selection).parentNode.classList.add("bg-success");
    audioSuccess.currentTime = 0;
    audioSuccess.play();
    rightQuestions++;
  } else {
    document.getElementById(selection).parentNode.classList.add("bg-danger");
    document
      .getElementById(idOfRightAnswer)
      .parentNode.classList.add("bg-success");
    audioSuccess.currentTime = 0;
    audioFail.play();
  }
  document.getElementById("next-button").disabled = false;
}

function nextQuestion() {
  currentQuestion++;
  document.getElementById("next-button").disabled = true;
  resetAnswerButtons();
  showQuestion();
}

function resetAnswerButtons() {
  for (let i = 1; i <= 4; i++) {
    let answerCard = document.getElementById(`answer_${i}`).parentNode;
    answerCard.classList.remove("bg-success");
    answerCard.classList.remove("bg-danger");
  }
}

function restartGame() {
  rightQuestions = 0;
  currentQuestion = 0;
  resetAnswerButtons();
  document.getElementById("next-button").disabled = true;
  updateQuizView();
}
