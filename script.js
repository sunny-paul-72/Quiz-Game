const questions = {
    general: [
        { question: "What is the capital of France?", choices: ["Berlin", "Madrid", "Paris", "Lisbon"], answer: "Paris" },
        { question: "Which planet is known as the Red Planet?", choices: ["Earth", "Mars", "Jupiter", "Saturn"], answer: "Mars" },
    ],
    physics: [
        { question: "What is the chemical symbol for water?", choices: ["H2O", "CO2", "O2", "H2"], answer: "H2O" },
        { question: "Who developed the theory of relativity?", choices: ["Isaac Newton", "Albert Einstein", "Nikola Tesla", "Marie Curie"], answer: "Albert Einstein" },
    ],
    hindi: [
        { question: "हिंदी वर्णमाला में कितने स्वर होते हैं?", choices: ["10", "12", "14", "16"], answer: "12" },
        { question: "भारत के पहले प्रधानमंत्री का नाम क्या था?", choices: ["महात्मा गांधी", "जवाहरलाल नेहरू", "सरदार पटेल", "सुभाष चंद्र बोस"], answer: "जवाहरलाल नेहरू" },
    ],
    english: [
        { question: "What is the synonym of 'Happy'?", choices: ["Sad", "Elated", "Angry", "Tired"], answer: "Elated" },
        { question: "What is the antonym of 'Quick'?", choices: ["Fast", "Slow", "Swift", "Rapid"], answer: "Slow" },
    ],
    math: [
        { question: "What is 5 + 3?", choices: ["5", "6", "8", "9"], answer: "8" },
        { question: "What is 12 x 12?", choices: ["120", "124", "144", "150"], answer: "144" },
    ],
};

const timings = {
    general: 60 * 60,  // 60 minutes
    physics: 50 * 60,  // 50 minutes
    hindi: 40 * 60,    // 40 minutes
    english: 30 * 60,  // 30 minutes
    math: 20 * 60,     // 20 minutes
};

let currentQuestionIndex = 0;
let score = 0;
let selectedCategory = null;
let selectedAnswers = [];
let timerInterval;
let timeRemaining = 60 * 60; // Default 60 minutes

// DOM Elements
const screens = {
    welcome: document.getElementById('welcome-screen'),
    categorySelection: document.getElementById('category-selection'),
    quiz: document.getElementById('quiz'),
    result: document.getElementById('result'),
};
const elements = {
    categoryDropdown: document.getElementById('category'),
    startBtn: document.getElementById('startBtn'),
    nextBtn: document.getElementById('nextBtn'),
    prevBtn: document.getElementById('prevBtn'),
    restartBtn: document.getElementById('restartBtn'),
    showAnswersBtn: document.getElementById('showAnswersBtn'),
    question: document.getElementById('question'),
    choices: document.getElementById('choices'),
    questionCounter: document.getElementById('questionCounter'),
    progressBar: document.getElementById('progress'),
    finalScore: document.getElementById('finalScore'),
    timer: document.getElementById('timer'),
    answersList: document.getElementById('answersList'),
};

// Helper functions
function switchScreen(from, to) {
    from.classList.add('hidden');
    to.classList.remove('hidden');
}

function startQuiz() {
    selectedCategory = elements.categoryDropdown.value;
    currentQuestionIndex = 0;
    score = 0;
    selectedAnswers = [];
    timeRemaining = timings[selectedCategory]; // Set timer according to category
    elements.timer.textContent = formatTime(timeRemaining);

    // Shuffle questions in the selected category
    shuffle(questions[selectedCategory]);

    startTimer();
    loadQuestion();
    switchScreen(screens.categorySelection, screens.quiz);
}

function loadQuestion() {
    const questionData = questions[selectedCategory][currentQuestionIndex];
    elements.question.textContent = questionData.question;
    elements.choices.innerHTML = '';

    questionData.choices.forEach((choice, index) => {
        const choiceBtn = document.createElement('button');
        choiceBtn.classList.add('choice-btn');
        choiceBtn.textContent = `${String.fromCharCode(65 + index)}. ${choice}`; // A, B, C, D

        // If the answer was previously selected, mark it
        if (selectedAnswers[currentQuestionIndex] === choice) {
            choiceBtn.classList.add('selected');
        }

        choiceBtn.addEventListener('click', () => handleAnswer(choice, choiceBtn));
        elements.choices.appendChild(choiceBtn);
    });

    updateProgress(currentQuestionIndex + 1, questions[selectedCategory].length);
    elements.questionCounter.textContent = `Question ${currentQuestionIndex + 1} of ${questions[selectedCategory].length}`;
    elements.nextBtn.disabled = selectedAnswers[currentQuestionIndex] === undefined;

    // Enable or disable the previous button based on the current question index
    elements.prevBtn.disabled = currentQuestionIndex === 0;
}

function handleAnswer(selectedChoice, button) {
    const questionData = questions[selectedCategory][currentQuestionIndex];

    // Remove 'selected' class from all buttons
    const buttons = elements.choices.querySelectorAll('button');
    buttons.forEach(btn => btn.classList.remove('selected'));

    // Add 'selected' class to the clicked button
    button.classList.add('selected');

    // Save the selected answer
    selectedAnswers[currentQuestionIndex] = selectedChoice;

    // Update score if answer is correct
    if (selectedChoice === questionData.answer) {
        score++;
    }

    // Enable the 'Next' button after selection
    elements.nextBtn.disabled = false;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function loadNextQuestion() {
    if (currentQuestionIndex < questions[selectedCategory].length - 1) {
        currentQuestionIndex++;
        loadQuestion();
    } else {
        showResults();
    }
}

function loadPreviousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        loadQuestion();
    }
}

function showResults() {
    clearInterval(timerInterval);
    elements.finalScore.textContent = `Your score: ${score} / ${questions[selectedCategory].length}`;
    switchScreen(screens.quiz, screens.result);
}

function toggleAnswers() {
    if (elements.answersList.classList.contains('hidden')) {
        populateAnswersList();
        elements.answersList.classList.remove('hidden');
    } else {
        elements.answersList.classList.add('hidden');
    }
}

function populateAnswersList() {
    elements.answersList.innerHTML = ''; // Clear the list before adding new items

    questions[selectedCategory].forEach((q, index) => {
        const answerItem = document.createElement('div');
        answerItem.classList.add('answer-item');
        const selectedAnswer = selectedAnswers[index];
        const correctAnswer = q.answer;

        // Add styles based on correct or incorrect answer
        if (selectedAnswer === correctAnswer) {
            answerItem.innerHTML = `
                <strong>Q${index + 1}: </strong>${q.question}<br>
                <strong>Your answer: </strong><span class="correct">${selectedAnswer}</span><br>
                <strong>Correct answer: </strong><span class="correct">${correctAnswer}</span>
            `;
        } else {
            answerItem.innerHTML = `
                <strong>Q${index + 1}: </strong>${q.question}<br>
                <strong>Your answer: </strong><span class="incorrect">${selectedAnswer || 'Not answered'}</span><br>
                <strong>Correct answer: </strong><span class="correct">${correctAnswer}</span>
            `;
        }

        elements.answersList.appendChild(answerItem);
    });
}

function updateProgress(current, total) {
    const percentage = (current / total) * 100;
    elements.progressBar.style.width = `${percentage}%`;
}

function startTimer() {
    timerInterval = setInterval(() => {
        timeRemaining--;
        elements.timer.textContent = formatTime(timeRemaining);
        if (timeRemaining === 0) {
            stopTimer();
            showResults();
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
    elements.timer.textContent = "Time's up!";
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secondsLeft = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secondsLeft).padStart(2, '0')}`;
}

// Event listeners
elements.startBtn.addEventListener('click', startQuiz);
elements.nextBtn.addEventListener('click', loadNextQuestion);
elements.prevBtn.addEventListener('click', loadPreviousQuestion);
elements.restartBtn.addEventListener('click', () => {
    score = 0;
    selectedAnswers = [];
    elements.finalScore.textContent = "";
    switchScreen(screens.result, screens.categorySelection);
});
elements.showAnswersBtn.addEventListener('click', toggleAnswers);

document.getElementById('welcomeStartBtn').addEventListener('click', () => switchScreen(screens.welcome, screens.categorySelection));
