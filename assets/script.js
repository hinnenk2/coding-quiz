// Declare Global Variables:
var timerEl = document.querySelector("header span#time");
var startDiv = document.querySelector("div.div-start");
var startButton = document.querySelector("button#start");
var questionDiv = document.querySelector("div.div-question");
var answerButtons = document.querySelector("div.buttons");
var questionEl = document.querySelector("h1#question");
var correctWrongEl = document.querySelector("div#correct-wrong");

// End of Quiz variables:
var endDiv = document.querySelector("div.div-end");
var finalScore = document.querySelector("h2 span#final-score");
var scoreForm = document.querySelector("form#score-form");
var inputInitials = document.querySelector("input#initials");

// Highscore elements:
var linkHighScore = document.querySelector("header div#highscore");
var highScore = document.querySelector("div.high-score");
var scoreList = document.querySelector("ol#highscore-list");
var clearScoreButton = document.querySelector("button#clear");
var goHome = document.querySelector("button#back");

// Quiz question bank.
var questionBank = [
    {
        question: "Commonly used datatypes DO NOT include?",
        possibleAnswers: ["Strings", "Booleans", "Alerts", "Numbers"],
        correctAnswer: 2
    },
    {
        question: "The condition statement if/else is enclosed with the following:",
        possibleAnswers: ["Parentheses", "Curly Brackets", "Quotes", "Square Brackets"],
        correctAnswer: 0
    },
    {
        question: "Arrays can be used to store the following",
        possibleAnswers: ["Number of strings", "Other arrays", "Booleans", "All of the above"],
        correctAnswer: 3
    },
    {
        question: "A very useful tool to debug arrays is:",
        possibleAnswers: ["JavaScript", "Terminal/Bash", "For-loops", "Console.log()"],
        correctAnswer: 2
    },
    {
        question: "Strings must be enclosed with:",
        possibleAnswers: ["Commas", "Curly Brackets", "Quotes", "Parentheses"],
        correctAnswer: 2
    },
];

var questionId = 0;  // determines the question to be displayed
var secondsRemaining = 60; // displays remaining time as well as the final score.
var timerInterval; // sets the timer intervals
var flashMessage; // determines the intervals at which correct/incorrect messages are displayed

// Functions required for hiding/displaying elements at the appropriate screen.
function hide(element) {
    element.setAttribute("style", "display: none;");
}

function show(element) {
    element.setAttribute("style", "display: block;");
}

// Quiz Functions
function displayQuestion() {
    var currentQuestion = questionBank[questionId]; 
    questionEl.textContent = currentQuestion.question; // displays the current question from the question bank
    var potentialAnswer = currentQuestion.possibleAnswers;  // displays all possible answers per question.
    for (var i = 0; i < potentialAnswer.length; i++) {    //Loops four times since there are 4 possible answers per question.
        answerButtons.children[i].textContent = potentialAnswer[i]; 
    }
}

// Quiz ends when the timer runs out or there are no more questions left
function endQuiz() {
    clearInterval(timerInterval); // required for ending the quiz

    // Ensures the score cannot go below 0.
    if (secondsRemaining < 0) {
        secondsRemaining = 0;
    }

    finalScore.textContent = secondsRemaining; // displays the seconds remaining as the score
    hide(questionDiv); // hides the question div since quiz is over
    show(endDiv); // end of quiz display
}

// Starts the timer and displays the time remaining.
function startTimer() {
    timerInterval = setInterval(function () {
        secondsRemaining--; // Time remaining goes down 1 second at a time.
        timerEl.textContent = secondsRemaining; // displays time left on top of screen
        if (secondsRemaining === 0) {  // if the timer runs out, the quiz ends.
            clearInterval(timerInterval);
            endQuiz();
        }
    }, 1000)
}

// Starts the quiz by clicking the Start Quiz! button
function startQuiz() {
    
    hide(startDiv); // hide start display from the question display
    displayQuestion(); // Present the first question from question bank
    show(questionDiv);
    startTimer();
}

startButton.addEventListener("click", startQuiz);

// loads the next question from the question bank
function nextQuestion() {

    // if there are more questions remaining in the question bank:
    if (questionId < questionBank.length - 1) {  //If on final question, questionId=3 and questionBank.length=3, so if statement will not execute.
        questionId++; //otherwise move onto the next question.
        displayQuestion();
    } else {
        // display end screen after showing if the answer to the final question is correct or wrong.
        setTimeout(function () {
            endQuiz();
        }, 500)
    }
}

// checks answer and displays if it is correct or incorrect
function checkAnswer(answer) {
    if (questionBank[questionId].correctAnswer == answer) {  // If answer is correct, flash the Correct! message.

        clearTimeout(flashMessage);
        correctWrongEl.setAttribute("class", "correct");
        correctWrongEl.textContent = "Correct!";
        show(correctWrongEl);
        flashMessage = setTimeout(function () {
            hide(correctWrongEl);  //Hides the correct/incorrect message after 1 second.
        }, 1000);
    } else {
        
        secondsRemaining -= 5; // If answer is wrong, flash Incorrect! messge and deduct 5 seconds from the timer.
        clearTimeout(flashMessage);
        correctWrongEl.setAttribute("class", "wrong")
        correctWrongEl.textContent = "Incorrect.";
        show(correctWrongEl);
        flashMessage = setTimeout(function () {
            hide(correctWrongEl);
        }, 1000);
    }
    nextQuestion(); // loads the next question
}

// Runs the checkAnswer function to check if answer is correct/incorrect.
answerButtons.addEventListener("click", function () {
    var element = event.target; //Makes the answer buttons clickable
    if (element.matches("button")) {
        checkAnswer(element.value);
    }
})

// Highscore List
var scores = [];  //Array holds all highscores loaded from localStorage

// Arranges the scores from highest to lowest in descending order.
function scoreCompare(a, b) {
    return b.score - a.score;
}

// displays score ranking on highscore screen
function displayScores() {
    // hide other displays when scores are being presented.
    hide(questionDiv);
    hide(endDiv);
    hide(startDiv);

    // Reset current score page
    scoreList.innerHTML = "";

    // sort scores in order from highest to lowest
    scores.sort(scoreCompare);
    //console.log(scores.length);
    for (var i = 0; i < scores.length; i++) { //scores.length should always be at least 1, therefore for loop will always register scores upon input of user initials.
        var li = document.createElement("li");
        li.textContent = `${scores[i].initials} - ${scores[i].score}`; //Text display on highscore list.
        scoreList.appendChild(li); //Adds a list item to the scoreList as a child element.
    }
    show(highScore);
}

// localStorage is updated with scores array
function scoreStorage() {
    localStorage.setItem("scores", JSON.stringify(scores));
}

// Loads scores in localStorage into the scores array.
function scoreLoad() {
    var storedScores = JSON.parse(localStorage.getItem("scores"));
    if (storedScores) {
        scores = storedScores;
    }
}

scoreLoad(); //Makes highscores viewable at Start screen

// Button for clearing the highscore list of all scores
clearScoreButton.addEventListener("click", function () {
    localStorage.clear();
    scores = [];
    displayScores();
})

// Home page button
goHome.addEventListener("click", function () {
    clearInterval(timerInterval);  // reset timer
    secondsRemaining = 60;
    questionId = 0;  // Reinitiate quiz variables
    timerEl.textContent = secondsRemaining;
   
    hide(highScore);
    show(startDiv);
})

// Allows for user to submit initials and score at end of quiz.
scoreForm.addEventListener("submit", function () {
    event.preventDefault();
    var initials = inputInitials.value.trim(); //Removes spaces from user's initials, if any.
    
    if (!initials) {  // prevents user from submitting score without initials.
        return;
    }

    var initialsScore = { initials: initials, score: secondsRemaining };     // declare an object with initials and score (length=2) 
    scores.push(initialsScore); // add initials/score to scores list
    inputInitials.value = ""; // clear initials

    
    scoreStorage(); // updates localStorage with newly-submitted scores
    displayScores();
})

linkHighScore.addEventListener("click", function () {  //Establishes a clickable link at top-left of page for highscore display.
    
    clearInterval(timerInterval);  // clear timer
    displayScores();  // display the highscore list
})