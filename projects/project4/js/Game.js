/* Treehouse FSJS Techdegree
 * Project 4 - OOP Game App
 * Game.js */

class Game {

    // Constructs a game by providing 3 properties: score, a list of phrases, and the one to be used.
    constructor(missed, phrases, activePhrase){
        this.missed = 0;
        this.phrases = [new Phrase("how are you"), 
                        new Phrase("sayonara"), 
                        new Phrase("hello and goodbye"), 
                        new Phrase("long live the king"), 
                        new Phrase("sunny side up")];
        this.activePhrase = null;
    }

    //methods
    startGame (){
        // accesses overlay dom element and hides the overlay
        document.getElementById('overlay').style.display = 'none'

        // picks a random phrase from the constructor function, and displays it to the screen.
        this.activePhrase = this.getRandomPhrase();
        this.activePhrase.addPhraseToDisplay();
    }

    getRandomPhrase (){
        // creates a phrase object by randomly choosing a phrase from the constructor
        // then passes it into a Phrase class constructor
        let phraseArr = this.phrases;
        let randomNum = Math.floor(Math.random() * phraseArr.length)
        return phraseArr[randomNum]
    }

    handleInteraction (clicked){
        //disables clicked letter
        clicked.disabled = true;
        // see if 'clicked' matches a letter in the phrase by getting the active Phrase for comparison
        let phraseObj = this.activePhrase;
        // compares clicked letter's text to all letters in the phrase.
        // Shows match in the dom if returns true.
        // checks score to see if all letters have been revealed.
        if(phraseObj.checkLetter(clicked.textContent)){
            clicked.classList.add('chosen');
            phraseObj.showMatchedLetter(clicked);
            if(this.checkForWin()){
                this.gameOver('win');
            }
        } else {
            // checks heart points to see if there is gameover
            clicked.classList.add('wrong');
            this.removeLife();
        }

    
    }

    removeLife (){
        // increments the missed score everytime method is called, and checks if the limit has been reached.
        // initiates the gameover method with the argument 'lose' if limit has been reached.
        this.missed ++
        let tries = Array.from(document.getElementsByClassName('tries'));
        let limit = tries.length
        // calculates number of remaining chances, and modifies healthy hearts to display lost hearts
        tries[limit - this.missed].firstElementChild.setAttribute('src', 'images/lostHeart.png')
        if (this.missed == limit) {
            this.gameOver('lose')
        }
    }

    checkForWin (){
        // checks to see how many letters in the dom tree still has the 'hide' class in their element tag.
        // when list of those elements reach zero in length, all letters have been guessed
        // initiates gameOver method with arg 'win'.
        let div = document.querySelector('div#phrase ul').children;
        let array = Array.from(div)
        let remaining = array.filter(li => li.classList.contains('hide')).length
        if(remaining == 0){
            return true
        }
    }

    gameOver (result){
        // Resets the overlay classlist for simplicity
        // adds the result arg as a class.
        document.getElementById('overlay').classList = ''
        document.getElementById('overlay').classList.add(result)
        // modifies gameover message based on result passed in.
        if(result === 'win'){
            document.getElementById('game-over-message').innerHTML = "Congratulations! YOU WIN!"
        } else {
            document.getElementById('game-over-message').innerHTML = "Sorry... TRY AGAIN!"
        }
        // When all work is done, reveal the overlay.
        document.getElementById('overlay').style.display = ''

        // reset gameboard
        document.querySelector('div#phrase ul').innerHTML = ''
        Array.from(document.getElementsByClassName('key')).forEach((item)=>{
            // resets all keys on the onscreen keyboard, from either wrong or right to simply... key
            if(item.classList.contains('chosen') || item.classList.contains('wrong')){
                item.classList = 'key'
                item.disabled = false;
            }
        })
        // resets the score for a new game.
        this.missed = 0;
        Array.from(document.getElementsByClassName('tries')).forEach(item =>{
            // resets the heart counters to all healthy hearts
            item.firstElementChild.setAttribute('src', 'images/liveHeart.png')
        })

    }
}