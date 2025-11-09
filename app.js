import { questionBank } from "./storage.js";

// ---------------------------------  DOM......  --------------------------------//

// Buttons....

const startBtn = document.getElementById("startBtn");
const submitBtn = document.getElementById("sbmtBtn");
const retryBtn = document.getElementById("retryBtn");
const showAnsBtn = document.getElementById("showAnsBtn");
const nextQuestionBtn = document.getElementById("nextQuestion");
const prevQuestionBtn = document.getElementById("prevQuestion");

// Display...

const quiz = document.getElementById("quiz");
const result = document.getElementById("result");
const help = document.getElementById("help");
const counter = document.getElementById("counter");

// Question Tracking.....

let score = 0;
let incorrectAnswer = [];
let userAnswers = [];
let currQuestionIndex = 0;
let shuffledQuestion;
let allOptionContainer;
let countdown;
let questionData;
// Function...

let messageTimeout;
function displayFirstQuestion() {
  help.textContent = ``;
  counter.textContent = ``;
  shuffledQuestion = randomizeArr(questionBank);
  questionData = shuffledQuestion[currQuestionIndex];
  console.log(`Currently on index: ${currQuestionIndex}`);
  retryBtn.style.display = "none";
  startBtn.style.display = "none";
  showAnsBtn.style.display = "none";
  submitBtn.style.display = "inline-block";
  nextQuestionBtn.style.display = "inline-block";

  quiz.innerHTML = "";
  const questionElem = document.createElement("div");
  questionElem.className = "question";
  questionElem.innerHTML = questionData.question;

  quiz.appendChild(questionElem);

  allOptionContainer = document.createElement("div");
  allOptionContainer.className = "options-container";
  const options = randomizeArr([...questionData.options]);
  for (let i = 0; i < options.length; i++) {
    const optionElem = document.createElement("input");
    optionElem.type = "radio";
    optionElem.name = "quiz";
    optionElem.id = options[i];
    const optionElemContainer = document.createElement("div");
    // optionElemContainer.className = "options-container";
    optionElem.value = options[i];

    const label = document.createElement("label");
    label.textContent = options[i];
    label.htmlFor = optionElem.id;
    allOptionContainer.appendChild(optionElemContainer);
    optionElemContainer.appendChild(optionElem);
    optionElemContainer.appendChild(label);
    quiz.appendChild(allOptionContainer);
  }

  timer();
  stateManager();
}

function nextQuestion() {
  const selected = document.querySelector("input[name='quiz']:checked");
  if (!selected) {
    help.textContent = `Please select an option!`;
    setTimeout(() => (help.textContent = ""), 3000);
    return;
  }
  chkAns();

  currQuestionIndex++;
  if (currQuestionIndex > 0) {
    prevQuestionBtn.style.display = "inline-block";
  }
  const questionData2 = shuffledQuestion[currQuestionIndex];
  if (currQuestionIndex === shuffledQuestion.length) {
    nextQuestionBtn.style.display = "none";
    console.table(shuffledQuestion);
    return;
  }
  quiz.innerHTML = "";
  const questionElem = document.createElement("div");
  questionElem.className = "question";
  questionElem.innerHTML = questionData2.question;

  allOptionContainer.innerHTML = "";
  quiz.appendChild(questionElem);

  const options = randomizeArr([...questionData2.options]);
  for (let i = 0; i < options.length; i++) {
    const optionElem = document.createElement("input");
    optionElem.type = "radio";
    optionElem.name = "quiz";
    optionElem.id = options[i];
    const optionElemContainer = document.createElement("div");
    // optionElemContainer.className = "options-container";
    optionElem.value = options[i];

    const label = document.createElement("label");
    label.textContent = options[i];
    label.htmlFor = optionElem.id;
    allOptionContainer.appendChild(optionElemContainer);
    optionElemContainer.appendChild(optionElem);
    optionElemContainer.appendChild(label);
    quiz.appendChild(allOptionContainer);
  }
  stateManager();
}

function chkAns() {
  const questionData = shuffledQuestion[currQuestionIndex];
  const selected = document.querySelector("input[name='quiz']:checked");
  if (selected) {
    const answer = selected.value;
    userAnswers[currQuestionIndex] = {
      question: questionData.question,
      answer,
      isCorrect: answer === questionData.answer,
    };
    console.table(userAnswers);
    if (answer === questionData.answer) {
      score += 10;
      console.log(score);
    } else {
      incorrectAnswer[currQuestionIndex] = {
        Question: questionData.question,
        Answer: answer,
        Correction: questionData.answer,
      };
      console.table(incorrectAnswer);
    }
  } else {
    help.textContent = `Please select an option!`;
    setTimeout(() => (help.textContent = ""), 3000);
    return;
  }
}

function submitWithoutConfirmation() {
  chkAns();
  startBtn.style.display = "none";
  nextQuestionBtn.style.display = "none";
  prevQuestionBtn.style.display = "none";
  submitBtn.style.display = "none";
  showAnsBtn.style.display = "none";
  retryBtn.style.display = "inline-block";
  if (incorrectAnswer.length > 0) {
    showAnsBtn.style.display = "inline-block";
  }

  quiz.innerHTML = "";
  quiz.innerHTML = `<p>Your score is <span>${score}/100</span>.</p>`;
  quiz.innerHTML += `<p>Let's do this again next time :)</p>`;
  score = 0;
  clearInterval(countdown);
  counter.textContent = `Finished!`;
}

function submit() {
  const confirmSubmit = confirm("Are you sure you want to submit?");
  if (!confirmSubmit) {
    return;
  }

  const selected = document.querySelector("input[name='quiz']:checked");
  if (selected) {
    const answer = selected.value;
    userAnswers.forEach((item) => {
      if (!item === answer) {
        userAnswers[currQuestionIndex] = {
          question: questionData.question,
          answer,
          isCorrect: answer === questionData.answer,
        };
        console.table(userAnswers);
        if (answer === questionData.answer) {
          score += 10;
          console.log(score);
        } else {
          incorrectAnswer[currQuestionIndex] = {
            Question: questionData.question,
            Answer: answer,
            Correction: questionData.answer,
          };
          console.table(incorrectAnswer);
        }
      }
    });
  }

  startBtn.style.display = "none";
  nextQuestionBtn.style.display = "none";
  prevQuestionBtn.style.display = "none";
  submitBtn.style.display = "none";
  showAnsBtn.style.display = "none";
  retryBtn.style.display = "inline-block";
  if (incorrectAnswer.length > 0) {
    showAnsBtn.style.display = "inline-block";
  }

  quiz.innerHTML = "";
  quiz.innerHTML = `<p>Your score is <span>${score}/100</span>.</p>`;
  quiz.innerHTML += `<p>Let's do this again next time :)</p>`;
  score = 0;
  clearInterval(countdown);
  counter.textContent = `Finished!`;
}

function hideBtns() {
  startBtn.style.display = "inline-block";
  nextQuestionBtn.style.display = "none";
  submitBtn.style.display = "none";
  retryBtn.style.display = "none";
  showAnsBtn.style.display = "none";
  prevQuestionBtn.style.display = "none";
}

function showAns() {
  showAnsBtn.style.display = "none";
  quiz.innerHTML = "";
  incorrectAnswer.forEach((item) => {
    quiz.innerHTML += `<div class="answer-display">
    <p>Question: ${item.Question}</p>
    <p>Your answer: <strong>${item.Answer}</strong></p>
    <p>Correct answer:  <strong>${item.Correction}</strong></p>
    </div>`;
  });
}

function prevQuestion() {
  if (currQuestionIndex > 0) {
    currQuestionIndex--;
    if (currQuestionIndex < shuffledQuestion.length) {
      nextQuestionBtn.style.display = "inline-block";
    }
    score -= 10;
    const questionData2 = shuffledQuestion[currQuestionIndex];
    quiz.innerHTML = "";
    const questionElem = document.createElement("div");
    questionElem.className = "question";
    questionElem.innerHTML = questionData2.question;

    quiz.appendChild(questionElem);

    const options = [...questionData2.options];

    allOptionContainer.innerHTML = "";
    for (let i = 0; i < options.length; i++) {
      const optionElem = document.createElement("input");
      optionElem.type = "radio";
      optionElem.name = "quiz";
      optionElem.id = options[i];
      const optionElemContainer = document.createElement("div");
      // optionElemContainer.className = "options-container";
      optionElem.value = options[i];

      const label = document.createElement("label");
      label.textContent = options[i];
      label.htmlFor = optionElem.id;
      allOptionContainer.appendChild(optionElemContainer);
      optionElemContainer.appendChild(optionElem);
      optionElemContainer.appendChild(label);
      quiz.appendChild(allOptionContainer);
    }
  }
  if (currQuestionIndex === 0) {
    prevQuestionBtn.style.display = "none";
  }
  stateManager();
}

function stateManager() {
  let savedAnswer = userAnswers[currQuestionIndex];
  if (!savedAnswer) return; // nothing saved yet
  else {
    savedAnswer = savedAnswer.answer;
    const inputs = document.querySelectorAll('input[name="quiz"]');
    inputs.forEach((input) => {
      if (input.value === savedAnswer) {
        input.checked = true;
      }
    });
  }
}

function randomizeArr(arr) {
  const shuffledArr = [...arr];
  for (let i = shuffledArr.length - 1; i > 0; i--) {
    const random = Math.floor(Math.random() * (i + 1));
    [shuffledArr[i], shuffledArr[random]] = [
      shuffledArr[random],
      shuffledArr[i],
    ];
  }
  return shuffledArr;
}

showAnsBtn.addEventListener("click", () => showAns());
startBtn.addEventListener("click", () => displayFirstQuestion());
retryBtn.addEventListener("click", () => displayFirstQuestion());
nextQuestionBtn.addEventListener("click", () => nextQuestion());
prevQuestionBtn.addEventListener("click", () => prevQuestion());
submitBtn.addEventListener("click", () => submit());
hideBtns();

// TODO: Implement state tracking — save user's selected answer for each question.

function timer() {
  let time = 120;
  countdown = setInterval(() => {
    counter.textContent = `You have ${time} seconds left`;
    time--;
    if (time < 0) {
      clearInterval(countdown);
      counter.textContent = `Time up!`;
      submitWithoutConfirmation();
    }
  }, 1000);
}

// TODO: Fix tbn hiding logic such that it actually runs at line 150.
