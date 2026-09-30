// @ts-nocheck
let rightQuestions = 0;

let currentQuestion = 0;

function init() {
  document.getElementById("all-questions").innerHTML = questions.length;

  showQuestion();
}

function showQuestion() {
  if (currentQuestion >= questions.length) {
    document.getElementById("endscreen").style = "";
    document.getElementById("question-body").style = "display: none;";
    document.getElementById("amount-of-questions").innerHTML = questions.length;
    document.getElementById("score").innerHTML = rightQuestions;
  } else {
    let question = questions[currentQuestion];

    document.getElementById("question-number").innerHTML = currentQuestion + 1;
    document.getElementById("questiontext").innerHTML = question["question"];
    document.getElementById("answer_1").innerHTML = question["answer_1"];
    document.getElementById("answer_2").innerHTML = question["answer_2"];
    document.getElementById("answer_3").innerHTML = question["answer_3"];
    document.getElementById("answer_4").innerHTML = question["answer_4"];
  }
}

function answer(selection) {
  let question = questions[currentQuestion];
  let selectedQuestionNumber = selection.slice(-1);
  let idOfRightAnswer = `answer_${question["right-answer"]}`;

  if (selectedQuestionNumber == question["right-answer"]) {
    document.getElementById(selection).parentNode.classList.add("bg-success");
    rightQuestions++;
  } else {
    document.getElementById(selection).parentNode.classList.add("bg-danger");
    document
      .getElementById(idOfRightAnswer)
      .parentNode.classList.add("bg-success");
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
