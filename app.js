// import { questionBank } from "./storage.js";
const questionBank = [
  {
    question: "What is the capital of France?",
    options: ["Berlin", "Madrid", "Paris", "Rome"],
    answer: "Paris",
  },
  {
    question: "Which language runs in a web browser?",
    options: ["Python", "C", "Java", "JavaScript"],
    answer: "JavaScript",
  },
  {
    question: "What does CSS stand for?",
    options: [
      "Central Style Sheets",
      "Cascading Style Sheets",
      "Cascading Simple Sheets",
      "Cars SUVs Sailboats",
    ],
    answer: "Cascading Style Sheets",
  },
  {
    question: "What year was JavaScript launched?",
    options: ["1996", "1995", "1994", "None of the above"],
    answer: "1995",
  },
  {
    question: "Which HTML tag is used to define an internal style sheet?",
    options: ["<script>", "<style>", "<css>", "<link>"],
    answer: "<style>",
  },
  {
    question: "Inside which HTML element do we put the JavaScript?",
    options: ["<javascript>", "<js>", "<script>", "<code>"],
    answer: "<script>",
  },
  {
    question: "Which company developed JavaScript?",
    options: ["Netscape", "Microsoft", "Sun Microsystems", "Oracle"],
    answer: "Netscape",
  },
  {
    question: "Which of the following is not a programming language?",
    options: ["Python", "HTML", "C++", "Java"],
    answer: "HTML",
  },
  {
    question: "What symbol is used for comments in JavaScript?",
    options: ["//", "/* */", "#", "<!-- -->"],
    answer: "//",
  },
  {
    question: "Which keyword is used to declare a constant in JavaScript?",
    options: ["var", "let", "const", "define"],
    answer: "const",
  },
];

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

// Question Tracking.....

let score = 0;
let incorrectAnswer = [];
let currQuestionIndex = 0;

// Function...
const shuffledQuestion = randomizeArr(questionBank);

let messageTimeout;
function displayQuestion() {
  const questionData = shuffledQuestion[currQuestionIndex];
  console.log(`Currently on index: ${currQuestionIndex}`);
  retryBtn.style.display = "none";
  startBtn.style.display = "none";
  showAnsBtn.style.display = "none";
  submitBtn.style.display = "inline-block";
  nextQuestionBtn.style.display = "inline-block";

  quiz.innerHTML = "";
  const questionElem = document.createElement("div");
  questionElem.className = "options";
  questionElem.innerHTML = questionData.question;

  quiz.appendChild(questionElem);

  const options = [...questionData.options];
  for (let i = 0; i < options.length; i++) {
    const optionElem = document.createElement("input");
    optionElem.type = "radio";
    optionElem.name = "quiz";
    const optionElemContainer = document.createElement("div");
    optionElem.value = options[i];

    const label = document.createElement("label");
    label.textContent = options[i];
    label.htmlFor = "quiz";
    optionElemContainer.appendChild(optionElem);
    optionElemContainer.appendChild(label);
    quiz.appendChild(optionElemContainer);
  }
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
    return;
  }
  quiz.innerHTML = "";
  const questionElem = document.createElement("div");
  questionElem.className = "options";
  questionElem.innerHTML = questionData2.question;

  quiz.appendChild(questionElem);

  const options = [...questionData2.options];
  for (let i = 0; i < options.length; i++) {
    const optionElem = document.createElement("input");
    optionElem.type = "radio";
    optionElem.name = "quiz";
    const optionElemContainer = document.createElement("div");
    optionElem.value = options[i];

    const label = document.createElement("label");
    label.textContent = options[i];
    label.htmlFor = "quiz";
    optionElemContainer.appendChild(optionElem);
    optionElemContainer.appendChild(label);
    quiz.appendChild(optionElemContainer);
  }
}

function chkAns() {
  const questionData = shuffledQuestion[currQuestionIndex];
  const selected = document.querySelector("input[name='quiz']:checked");
  if (selected) {
    const answer = selected.value;
    if (answer === questionData.answer) {
      score += 10;
      console.log(score);
    } else {
      incorrectAnswer.push({
        Question: questionData.question,
        Answer: answer,
        Correction: questionData.answer,
      });
      console.table(incorrectAnswer);
    }
  } else {
    const selected = document.querySelector("input[name='quiz']:checked");
    if (!selected) {
      help.textContent = `Please select an option!`;
      setTimeout(() => (help.textContent = ""), 3000);
      return;
    }
  }
}

function submit() {
  const confirmSubmit = confirm("Are you sure you want to submit?");
  if (!confirmSubmit) {
    return;
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
  quiz.innerHTML = `<p>Your score is <span>${score}</span>.</p>`;
  quiz.innerHTML += `<p>Let's do this again next time :)</p>`;
  score = 0;
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

    const questionData2 = shuffledQuestion[currQuestionIndex];
    quiz.innerHTML = "";
    const questionElem = document.createElement("div");
    questionElem.className = "options";
    questionElem.innerHTML = questionData2.question;

    quiz.appendChild(questionElem);

    const options = [...questionData2.options];
    for (let i = 0; i < options.length; i++) {
      const optionElem = document.createElement("input");
      optionElem.type = "radio";
      optionElem.name = "quiz";
      const optionElemContainer = document.createElement("div");
      optionElem.value = options[i];

      const label = document.createElement("label");
      label.textContent = options[i];
      label.htmlFor = "quiz";
      optionElemContainer.appendChild(optionElem);
      optionElemContainer.appendChild(label);
      quiz.appendChild(optionElemContainer);
    }
  }
  if (currQuestionIndex === 0) {
    prevQuestionBtn.style.display = "none";
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
startBtn.addEventListener("click", () => displayQuestion());
retryBtn.addEventListener("click", () => displayQuestion());
nextQuestionBtn.addEventListener("click", () => nextQuestion());
prevQuestionBtn.addEventListener("click", () => prevQuestion());
submitBtn.addEventListener("click", () => submit());
hideBtns();

// TODO: Implement state tracking — save user's selected answer for each question.
