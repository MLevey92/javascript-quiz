var scores = document.getElementById("highscores");
const clearBtn = document.getElementById("clearButton");

var scoresList = JSON.parse(localStorage.getItem("playerScores"));

//sorts scoresList descending by score; highest scores first
if(scoresList !== null) {
    scoresList.sort((a,b) => (a.score < b.score) ? 1 : -1)
}

populateList();

//appends scores to highscore list
function populateList() {
    if(scoresList !== null) {
        var liEl;
        for (let i=0;i<scoresList.length;i++){
            liEl = document.createElement("li");
            liEl.textContent = scoresList[i].initials + " -- " + scoresList[i].score;
            scores.appendChild(liEl);
        }
    } 
}

//clears local storage and refreshes page
clearBtn.addEventListener("click", function() {
    localStorage.clear();
    location.reload();
})

