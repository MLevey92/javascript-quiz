const timer = document.getElementById("time");
const startButton = document.getElementById("startButton");
const startContainer = document.querySelector(".start-container");
const questionContainers = document.querySelectorAll(".question-container");
const wrongAnswer = document.querySelectorAll(".answer.wrong");
const wrongCount = document.getElementById("wrong");
const correctCount = document.getElementById("correct");
const correctAnswer = document.querySelectorAll(".answer.correct");
const score = document.getElementById("score");
const result = document.querySelectorAll(".result");
const endContainer = document.querySelector(".end-container");
const form = document.querySelector("form");
var initials = document.getElementById("initials");

var numCorrect=0;
var numWrong=0;
var finalScore=0;
var secondsLeft = 60;

//Decrements after every question. When 0, no more questions are left and game ends.
var availableQuestions = questionContainers.length;

//this var keeps track of which question we're on, so we can change attributes accordingly
var currentDivIndex;

//set active container to endgame. called when time runs out or last question is answered.
function endGame() {
    endContainer.setAttribute("class", "end-container active");

    correctCount.innerHTML = numCorrect;
    wrongCount.innerHTML = numWrong;

    //final score = 10 points per correct, + excess time
    finalScore = (numCorrect*10)+secondsLeft;
    score.innerHTML = finalScore;
}

function setTimer() {
  // Sets interval in variable
  var timerInterval = setInterval(function() {
    secondsLeft--;
    timer.textContent = secondsLeft;

    //timer stops if under 0, or if questions run out.
    if(secondsLeft <= 0 || availableQuestions === 0) {
        //prevents secondsLeft from becoming negative on wrong answer
        secondsLeft=0;
        timer.textContent = secondsLeft;
      // Stops execution of action at set interval
      clearInterval(timerInterval);
      removeQuestion(currentDivIndex);
      endGame();
      return;
    }

  }, 1000);
}

//choose a random question and set it to active
function nextQuestion() {
    //Base Case: if none of the questions are "available", they are all done and quiz ends
    if (availableQuestions === 0) {
        endGame();
        return;
    }
    //choose a random index based on length of questions nodeList
    var index = Math.floor(Math.random()*questionContainers.length);

    //get attributes and see if question includes "available"
    var sAttributes = questionContainers[index].getAttribute("class");
    var aAttributes = sAttributes.split(" ");

    //If question includes "available", it is not used yet; Continue. 
    //Otherwise, call nextQuestion again.
    if (aAttributes.includes("available")) {
        currentDivIndex = index;
        const currentQuestion = questionContainers[index]; 
        currentQuestion.setAttribute("class", "question-container active");
    } else {
        nextQuestion();
    }

}

//sets the current question to inactive, and removes from pool of questions.
function removeQuestion(index) {
    questionContainers[index].setAttribute("class", "question-container inactive");
    availableQuestions--;
}

//start button sets quiz intro to inactive and calls nextQuestion
startButton.addEventListener("click", function() {
    startContainer.setAttribute("class", "start-container inactive");
    setTimer();
    nextQuestion();
});

//Wrong answer button listener
wrongAnswer.forEach(item => {
    item.addEventListener('click', function() {
        result[currentDivIndex].innerHTML="Wrong !";
        numWrong++;
        secondsLeft-=10;
        setTimeout(function() {
            result[currentDivIndex].innerHTML="";
            removeQuestion(currentDivIndex);
            nextQuestion();
        }, 2000);

    })
});

//Correct Answer button listener
correctAnswer.forEach(item => {
    item.addEventListener('click', function() {
        result[currentDivIndex].innerHTML="Correct !";
        numCorrect++;
        setTimeout(function() {
            result[currentDivIndex].innerHTML="";
            removeQuestion(currentDivIndex);
            nextQuestion();
        }, 2000);

    })
});

//form submit listener
form.addEventListener('submit', function(event) {
    event.preventDefault();
    var scores = [];
    
    //check localStorage for pre-existing scores, and adds to scores array
    var lastScores = JSON.parse(localStorage.getItem("playerScores"));
    if (lastScores !== null) {
        for (let i=0;i<lastScores.length;i++) {
            scores.push(lastScores[i]);
        }
    }

    //create new score based on current game
    var playerScore = {
        initials: initials.value,
        score: finalScore
    }

    //push current score to scores array
    scores.push(playerScore);

    //stringify and push to localStorage
    localStorage.setItem("playerScores", JSON.stringify(scores))
})