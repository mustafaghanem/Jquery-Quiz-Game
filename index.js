let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let answerSelected = false;

function randomAnswerArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const random = Math.floor(Math.random() * (i + 1));
    [array[i], array[random]] = [array[random], array[i]];
  }
}

function showQuestion() {
  if (currentQuestionIndex < questions.length) {
    const query = questions[currentQuestionIndex];
    renderQuestion(query.question);
    renderAnswers(query.correct_answer, query.incorrect_answers);
    answerSelected = false;
    $("#next").prop("disabled", true);
  } else {
    $("#question").addClass("summary-question").html("Quiz completed!");
    clearAnswers();
    $("#answer-btn").html(
      `You answered  ${score} out of ${questions.length}  questions correctly.`
    );
    $("#next").hide();
  }
}

function renderQuestion(questionText) {
  $("#question").html(questionText);
}

function clearAnswers() {
  const answerButtons = $(".btn1, .btn2, .btn3, .btn4");
  answerButtons
    .removeClass("correct-answer incorrect-answer")
    .prop("disabled", false);
  answerButtons.html("");
}

function renderAnswers(correctAnswer, incorrectAnswers) {
  const answerButtons = $(".btn1, .btn2, .btn3, .btn4");
  const allAnswers = [correctAnswer, ...incorrectAnswers];
  randomAnswerArray(allAnswers);

  answerButtons
    .removeClass("correct-answer incorrect-answer")
    .prop("disabled", false);

  answerButtons.html(function (index) {
    return allAnswers[index];
  });

  answerButtons.on("click", function () {
    if (answerSelected) return;
    const selectedAnswer = $(this);
    answerSelected = true;
    if (selectedAnswer.html() === correctAnswer) {
      selectedAnswer.addClass("correct-answer");
      score++;
    } else {
      selectedAnswer.addClass("incorrect-answer");
      answerButtons
        .filter(function () {
          return $(this).html() === correctAnswer;
        })
        .addClass("correct-answer");
    }
    answerButtons.off("click");
    answerButtons.prop("disabled", true);
    $("#next").prop("disabled", false);
    answerButtons.off("click").prop("disabled", true);
    $("#next").prop("disabled", false);
  });
}

$(document).ready(function () {
  $.get(
    "https://opentdb.com/api.php?amount=5&category=25&difficulty=easy&type=multiple",
    (data) => {
      questions = data.results;
      showQuestion();
    }
  );
  $("#next").on("click", function () {
    currentQuestionIndex++;
    showQuestion();
  });
});
