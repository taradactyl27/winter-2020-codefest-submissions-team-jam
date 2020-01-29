/********************************* CONSTANTS *********************************/

const LEARNED = 2;
const ALMOST_OK = 1;
const PRACTICE = 0;

/********************************* ASYNC *********************************/

/**
 * Makes an ajax request to get the list of words. This function works
 * asynchronously, so the state should be setup after it completes.
 */
function fetchWords() {
    window.setTimeout(function() {
        //in reality, this would come from the API in a callback
        var data = ["hello", "friend", "pencil", "car", "apple", "thinking", "thought", "music", "magical"];
        game = new Review(data);
    }, 1000);
}

/**
 * This sets up the honeycomb hexagons with letters. It should be run once when
 * the document is loaded. Each letter is given the appropriate offset from the 
 * rest of the grid.
 */
function setup(){
    var i = document.getElementById("letter_input").childNodes;
    i[1].style.transform='translateY(82px)';
    i[1].contentDocument.getElementById("text").textContent='F';
    i[3].style.transform='translateY(164px)';
    i[3].contentDocument.getElementById("text").textContent='K';
    i[5].style.transform='translateY(246px)';
    i[5].contentDocument.getElementById("text").textContent='P';
    i[7].style.transform='translateY(328px)';
    i[7].contentDocument.getElementById("text").textContent='U';
    i[9].style.transform='translate(71px,41px)';
    i[9].contentDocument.getElementById("text").textContent='B';
    i[11].style.transform='translate(71px,123px)';
    i[11].contentDocument.getElementById("text").textContent='G';
    i[13].style.transform='translate(71px,205px)';
    i[13].contentDocument.getElementById("text").textContent='L';
    i[15].style.transform='translate(71px,287px)';
    i[15].contentDocument.getElementById("text").textContent='Q';
    i[17].style.transform='translate(71px,369px)';
    i[17].contentDocument.getElementById("text").textContent='V';
    i[19].style.transform='translate(142px,0px)';
    i[19].contentDocument.getElementById("text").textContent='C';
    i[21].style.transform='translate(142px,82px)';
    i[21].contentDocument.getElementById("text").textContent='H';
    i[23].style.transform='translate(142px,164px)';
    i[23].contentDocument.getElementById("text").textContent='M';
    i[25].style.transform='translate(142px,246px)';
    i[25].contentDocument.getElementById("text").textContent='R';
    i[27].style.transform='translate(142px,328px)';
    i[27].contentDocument.getElementById("text").textContent='W';
    i[29].style.transform='translate(142px,410px)';
    i[29].contentDocument.getElementById("text").textContent='Z';
    i[31].style.transform='translate(213px,41px)';
    i[31].contentDocument.getElementById("text").textContent='D';
    i[33].style.transform='translate(213px,123px)';
    i[33].contentDocument.getElementById("text").textContent='I';
    i[35].style.transform='translate(213px,205px)';
    i[35].contentDocument.getElementById("text").textContent='N';
    i[37].style.transform='translate(213px,287px)';
    i[37].contentDocument.getElementById("text").textContent='S';
    i[39].style.transform='translate(213px,369px)';
    i[39].contentDocument.getElementById("text").textContent='X';
    i[41].style.transform='translate(284px,0px)';
    i[41].contentDocument.getElementById("text").textContent='E';
    i[43].style.transform='translate(284px,82px)';
    i[43].contentDocument.getElementById("text").textContent='J';
    i[45].style.transform='translate(284px,164px)';
    i[45].contentDocument.getElementById("text").textContent='O';
    i[47].style.transform='translate(284px,246px)';
    i[47].contentDocument.getElementById("text").textContent='T';
    i[49].style.transform='translate(284px,328px)';
    i[49].contentDocument.getElementById("text").textContent='Y';
    fetchWords();
}
window.onload = setup;

/********************************* GAME STATE ********************************/

class Review {
    constructor(words) {
        this.words = words;
        //suffle the words
        for(let i = 0; i < this.words.length; i++) {
            let temp = this.words[i];
            let i2 = parseInt(Math.random() * this.words.length)
            this.words[i] = this.words[i2];
            this.words[i2] = temp;
        }
        //setup the spacial repetition stages
        this.stages = [
            gameState.words.map(function(arrayElement, index) {
                return {
                    word: arrayElement,
                    correct: false
                };
            }),
            [],
            []
        ];
        this.input = "";
        this.word = 0;
        this.stage = PRACTICE;
        this.cycleStop = PRACTICE;
    }
    /**
     * A constant getter function that retrieves the currently "displayed" word
     * @return (string) the current word
     */
    peekWord() {
        return this.stages[this.stage][this.word].word;
    }
    /**
     * Marks the current spelling of the current word as correct or incorrect.
     * @param status (string) true if the word should be correct, false otherwise
     */
    setIsCorrect(status) {
        this.stages[this.stage][this.word].correct = status;
    }
    /**
     * Sets the spelling to the provided string. Should come from user input.
     * This method also records whether the current spelling is correct or
     * not.
     * @param str  (string) the input to replace the old one
     * @return     (boolean) see checkSpelling()
     */
    setInput(str) {
        this.input = str;
        var correct = this.checkSpelling();
        this.setIsCorrect(correct);
        return correct;
    }
    /**
     * Same as above, but appends instead of replacing the input.
     */
    addInput(letter) {
        return this.setInput(this.input + letter);
    }
    /**
     * Returns true if the spelling of current word is correct, false if not.
     */
    checkSpelling() {
        return this.peekWord() == this.input;
    }
    spatialLearning() {
        //
    }
    nextWord() {
        //
    }
    /**
     * Returns true if every word was spelled correctly enough times, false otherwise.
     */
    done() {
        return (this.stage == this.cycleStop) && (this.stages[LEARNED].length == this.words.length);
    }
}

/* This global variable will be an instance of Review and control the state */
var game;

/** */
function addLetter(obj) {
    var letter = obj.getElementById("text").textContent;
    var guess = document.getElementById("card").contentDocument.getElementById("text").textContent;
    console.log(letter);
    for (var j = 0; j < guess.length; j++){
        if (guess[j] == '_'){
            guess = setCharAt(guess,j,letter);
            document.getElementById("card").contentDocument.getElementById("text").textContent = guess;
            if (j == guess.length-1){
                if(guess == "BEAUTY"){
                    alert("That's Right!");
                    //run correct word animation and flip to show definition
                }
                else{
                    document.getElementById("card").contentDocument.getElementById("text").textContent = "______";
                    //wrong answer, reset the card and show option to give up
                }
            }
            break;
        }
    }
}