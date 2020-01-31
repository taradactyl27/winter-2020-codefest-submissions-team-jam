/**
 * This is invoked when the speaker icon is clicked. It asks the browser to
 * speak aloud the current word. See img/speaker.svg
 * @param word  (string) the word to pronounce. Will be preceded by "Spell _"
 */
function textToSpeech(word) {
    var available_voices = window.speechSynthesis.getVoices();
    var eng_voice = '';
    for(var i=0; i<available_voices.length; i++) {
        if(available_voices[i].lang === 'en-US') {
            english_voice = available_voices[i];
            break;
        }
    }
    if(english_voice === '')
        english_voice = available_voices[0];
    var utter = new SpeechSynthesisUtterance();
    utter.rate = 1;
    utter.pitch = 0.5;
    utter.text = 'Spell ' + word;
    utter.voice = english_voice;
    window.speechSynthesis.speak(utter);
}

/**
 * This is a polyfill for the java-style setCharAt(int index) method of strings
 * which has no convenient equivalent in javascript. It will return a new
 * string with 1 character replaced if all the parameters are appropriate.
 * @param str    (string) the string to be edited
 * @param index  (int) the index of the character in the string to be replaced
 * @param chr    (string) the character to put in the specified index
 * @return       (string) new string with replacement or the same one if
 *               the index was out of bounds
 */
function setCharAt(str,index,chr) {
    if(index > str.length-1) return str;
    return str.substr(0,index) + chr + str.substr(index+1);
}

/**
 * Dynamically makes an SVG element.
 * @param tag  (string) the name of the svg tag
 * @param attributes  (object) key-value pairs for attributes
 * @param content     [optional] if this is a string, then it will become
 *                    the text content of this svg element. If it is an
 *                    svg element, then it will be appended to this one.
 */
function makeSVG(tag, attributes, content) {
    var node = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for(var k in attributes) {
        node.setAttribute(k, attributes[k]);
    }
    if(typeof content === "string") {
        tag.textContent = content;
    } 
    else if(typeof content != "undefined") {
        tag.appendChild(content);
    }
    return node;
}

/**
 * Displays text in the main flashcard. If one argument is provided, then this
 * just replaces the old text with the new one. If two arguments are
 * provided, an index and a character, then the setCharAt() function is called
 * on the old text.
 */
function displayFlashcard(text) {
    var card = document.getElementById("card").contentDocument.getElementById("text");
    card.style.fontSize = "128px";
    if(arguments.length == 1) {
        card.textContent = text;
    } else {
        card.textContent = setCharAt(card.textContent, arguments[0], arguments[1]);
    }
}

var flashCardClick;

/**
 * Meant to display big text popup covering the whole screen.
 */
function displayMessage(text, onClick) {
    var card = document.getElementById("card").contentDocument.getElementById("text");
    card.style.fontSize = "14px";
    card.style.fill = "black";
    card.style.letterSpacing = "0px";
    card.textContent = text;
    card.removeEventListener("click", flashCardClick);
    flashCardClick = onClick;
    card.addEventListener("click", onClick);
}