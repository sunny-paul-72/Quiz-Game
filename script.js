const questions = {
    general: [
      { question: "What is the capital of France?", choices: ["Berlin", "Madrid", "Paris", "Lisbon"], answer: "Paris" },
      { question: "Which planet is known as the Red Planet?", choices: ["Earth", "Mars", "Jupiter", "Saturn"], answer: "Mars" },
      // More questions...
    ],
    physics: [
      { question: "What is the chemical symbol for water?", choices: ["H2O", "CO2", "O2", "H2"], answer: "H2O" },
      { question: "Who developed the theory of relativity?", choices: ["Isaac Newton", "Albert Einstein", "Nikola Tesla", "Marie Curie"], answer: "Albert Einstein" },
      // More questions...
    ],
    chemistry: [
      { question: "Who was the first president of the USA?", choices: ["George Washington", "Abraham Lincoln", "Thomas Jefferson", "John Adams"], answer: "George Washington" },
      { question: "In what year did World War II end?", choices: ["1945", "1918", "1939", "1963"], answer: "1945" },
      // More questions...
    ],
    math: [
        { question: "What is 2+2?", choices: ["2", "3", "4", "5"], answer: "4" },
        { question: "What is 5x5?", choices: ["15", "20", "25", "30"], answer: "25" },
        // More questions...
    ],
    english: [
        { question: "What is the synonym of 'happy'?", choices: ["Sad", "Joyful", "Angry", "Tired"], answer: "Joyful" },
        { question: "Which word means 'to run'?", choices: ["Sprint", "Sit", "Stand", "Crawl"], answer: "Sprint" },
        // More questions...
    ]
};

// Timer settings in minutes (60 minutes = 60)
const categoryTimes = { 
  general: 60,  
  physics: 60,  
  chemistry: 60, 
  math: 60,     
  english: 60   
};

let score = 0;
let currentQuestionIndex = 0;
let timeLeft = 0;
let timerInterval = null;
let selectedCategory = null;

const categorySelection = document.getElementById('category-selection');
const quizContainer = document.getElementById('quiz');
const resultContainer = document.getElementById('result');
const questionElement = document.getElementById('question');
const choicesElement = document.getElementById('choices');
const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('timer');
const feedbackElement = document.getElementById('feedback');
const nextBtn = document.getElementById('nextBtn');
const restartBtn = document.getElementById('restartBtn');
const startBtn = document.getElementById('startBtn');
const progressElement = document.getElementById('progress');
const finalScoreElement = document.getElementById('finalScore');

// Event listener for category selection
startBtn.addEventListener('click', () => {
    selectedCategory = document.getElementById('category').value;
    categorySelection.classList.add('hidden');
    quizContainer.classList.remove('hidden');
    loadQuestion();
    startTimer();
});

// Load current question
function loadQuestion() {
    const currentQuestion = questions[selectedCategory][currentQuestionIndex];
    questionElement.textContent = currentQuestion.question;
    choicesElement.innerHTML = '';
    currentQuestion.choices.forEach(choice => {
        const button = document.createElement('button');
        button.textContent = choice;
        button.addEventListener('click', () => handleAnswer(choice));
        choicesElement.appendChild(button);
    });
    nextBtn.disabled = true;
    feedbackElement.classList.add('hidden');
}

// Handle user's answer
function handleAnswer(selectedChoice) {
    const currentQuestion = questions[selectedCategory][currentQuestionIndex];
    const allButtons = choicesElement.querySelectorAll('button');
    allButtons.forEach(button => button.disabled = true);

    // Change the background color of the clicked button to #bcf5d4
    allButtons.forEach(button => {
        if (button.textContent === selectedChoice) {
            button.style.backgroundColor = '#f57600';  // Set the background color
        }
    });

    if (selectedChoice === currentQuestion.answer) {
        score++;
        feedbackElement.classList.remove('hidden');
        allButtons.forEach(button => {
            if (button.textContent === currentQuestion.answer) {
                button.classList.add('correct');
            }
        });
    } else {
        feedbackElement.classList.remove('hidden');
        allButtons.forEach(button => {
            if (button.textContent === currentQuestion.answer) {
                button.classList.add('correct');
            } else if (button.textContent === selectedChoice) {
                button.classList.add('incorrect');
            }
        });
    }

    scoreElement.textContent = `Score: ${score}`;
    nextBtn.disabled = false;
}

// Next Question
nextBtn.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions[selectedCategory].length) {
        loadQuestion();
        startTimer();
    } else {
        showResult();
    }
});

// Show Result
function showResult() {
    quizContainer.classList.add('hidden');
    resultContainer.classList.remove('hidden');
    finalScoreElement.textContent = `You scored ${score} out of ${questions[selectedCategory].length}`;
}

// Restart Quiz
restartBtn.addEventListener('click', () => {
    currentQuestionIndex = 0;
    score = 0;
    resultContainer.classList.add('hidden');
    categorySelection.classList.remove('hidden');
});

// Timer function
function startTimer() {
    timeLeft = categoryTimes[selectedCategory] * 60;  // Convert minutes to seconds
    progressElement.style.width = '100%';
    updateTimerDisplay(timeLeft);
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay(timeLeft);
        progressElement.style.width = `${(timeLeft / (categoryTimes[selectedCategory] * 60)) * 100}%`;
        if (timeLeft === 0) {
            clearInterval(timerInterval);
            feedbackElement.textContent = "Time's up!";
            feedbackElement.classList.remove('hidden');
            nextBtn.disabled = false;
        }
    }, 1000);
}

function updateTimerDisplay(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    timerElement.textContent = `Time: ${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}
