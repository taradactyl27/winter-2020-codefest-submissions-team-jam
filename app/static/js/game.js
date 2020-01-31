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
        var data = ["car", "hello"];
        game = new Review(data);
        displayFlashcard(game.peekWord().replace(/./g, "_"));
        console.log("Word is: ", game.peekWord());
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
    //displayMessage(); //hide popup
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
            this.words.map(function(arrayElement, index) {
                return {
                    word: arrayElement,
                    correct: false
                };
            }),
            [],
            []
        ];
        this.input = "";
        this.word = 0;              /*The index of the current word within the
                                      current stage */
        this.stage = PRACTICE;      /*The index of the current stage (which has
                                      many words in it) */
        this.cycleStop = PRACTICE+1;/*The last stage to do in this loop. Each
                                      time the spatial learning algorithm is
                                      applied, this boundary increases until
                                      it wraps around to the beginning. */
        this.numLearns = 0;         /*The number of times the spatial learning
                                      algorithm was called. Used to keep track
                                      of which words were processed by the
                                      current iteration of the algorithm.
                                      PRIVATE VARIABLE*/
        //bind instance methods
        this.peekWord = this.peekWord.bind(this);
        this.setIsCorrect = this.setIsCorrect.bind(this);
        this.setInput = this.setInput.bind(this);
        this.spatialLearning = this.spatialLearning.bind(this);
    }
    /**
     * A constant getter function that retrieves the currently "displayed" word
     * @return (string) the current word
     */
    peekWord() {
        return this.stages[this.stage][this.word].word || "";
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
     * Returns the length of the current user input
     */
    lenInput() {
        return this.input.length;
    }
    /**
     * Returns true if the spelling of current word is correct, false if not.
     */
    checkSpelling() {
        return this.peekWord().toLowerCase() == this.input.toLowerCase();
    }
    spatialLearning() {
        //loop through each stage that was just completed
        for(let s = PRACTICE; s <= this.cycleStop; s++) {
            let w = 0;
            //loop through each word in this stage
            while(w < this.stages[s].length) {
                /*if this word hasn't been updated yet in this function call*/
                if(this.stages[s][w].updated != this.numLearns) {
                    this.stages[s][w].updated = this.numLearns;
                    /*if correct spelling and word is not mastered, move it up to
                      next level of memorization (less frequent repetition) */
                    if(this.stages[s][w].correct && s != LEARNED) {
                        this.stages[s+1].push(this.stages[s].splice(w, 1));
                    }
                    /*if incorrect spelling and word is not already in lowest 
                      level of memorization, move it to lowest level of memorization 
                      (most frequent repetition) */
                    else if(this.stages[s][w].correct == false && s != PRACTICE) {
                        this.stages[PRACTICE].push(this.stages[s].splice(w, 1));
                    }
                    /*if the word wasn't moved, process the next one*/
                    else {
                        w++;
                    }
                }
                else {
                    w++;
                }
            }
        }
        this.numLearns++;
        console.log(`Stage ${this.stage}/${this.stages.length} and word ${this.word}/${this.stages[this.stage].length}`);
        console.log("Practicing: " + this.stages[0].length + ", Mid: " + this.stages[1].length + ", Learned: " + this.stages[2].length);
    }
    /**
     * Advances internal pointers to the next word. Sometimes, the spatial
     * learning algorithm is applied to reorder the words in a way to enhance
     * memorization. This is managed internally by "stages of memorization."
     */
    nextWord() {
        this.word++;
        console.log(this.word + "whaaat " + this.stages[this.stage].length);
        if(this.word == this.stages[this.stage].length) {
            this.stage++;
            this.word = 0;
            if(this.stage >= this.cycleStop) {
                this.spatialLearning();
                this.cycleStop++;
                //advance to first stage that has words in it (nonempty)
                for(let s = PRACTICE; s < this.stages.length; s++) {
                    if(this.stages[s].length > 0) {
                        this.stage = s;
                        break;
                    }
                }
                if(this.cycleStop == this.stages.length) {
                    this.cycleStop = PRACTICE;
                }
            }
        }
    }
    /**
     * Returns true if every word was spelled correctly enough times, false otherwise.
     */
    done() {
        return this.stage == 1;
        //return (this.stage == this.cycleStop) && (this.stages[LEARNED].length == this.words.length);
    }
}

/* This global variable will be an instance of Review and control the state */
var game;

/**
 * This global callback function should be used as a callback when animations
 * are completed. It will ask the game for the next word and display blanks
 * in the flashcard. If we ran out of words, then a "winner" message will be
 * displayed and the player should be asked if they want a different set of
 * words. The input will always be reset.
 */
function next() {
            console.log("word: " + game.word + " stage: " + game.stage);

    game.nextWord();
    if(!game.done()) {
        game.setInput("");
        displayFlashcard(game.peekWord().replace(/./g, "_"));
        console.log("Word is: ", game.peekWord());
    }
    else {
        alert("Winner!");
        //call fetchWords() here again to get new words
    }
}

/** */
function addLetter(obj) {
    var letter = obj.getElementById("text").textContent;
    //show the new letter in the spelling
    displayFlashcard(game.lenInput(), letter);
    //check if the spelling is correct
    if(game.addInput(letter)) {
        //correct
        // displayMessage("That's right! Click to go to the next word.", function() {
        //     next();
        // });
        alert("That's right!");
        next();
    }
    else {
        //not done yet...
        if(game.lenInput() == game.peekWord().length) {
            //wrong spelling
            alert("You got it wrong");
            next();
        }
    }
}

/**
 * Event listener for speaker icon. Says "Spell" + word
 */
function pronounce() {
    textToSpeech(game.peekWord());
}