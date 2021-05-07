/* Treehouse FSJS Techdegree
 * Project 4 - OOP Game App
 * Phrase.js */

class Phrase {
    constructor(phrase){
        this.phrase = phrase;
    }

    // This method should only be called once per game, to decorate the screen with the chosen phrase
    addPhraseToDisplay () {
        let div = document.querySelector('div#phrase ul');
        let expression = this.phrase
        for (let e of expression) {
            let li = document.createElement('li')
            li.textContent = e;
            if (e === " "){
                li.setAttribute('class', 'space');
            } else {
                li.setAttribute('class', 'hide letter '+e)
            }
            div.appendChild(li);
        }     
    }

    //When a letter is guessed, this method returns true or false
    // It's more of a middle-man function along other, greater functions.
    checkLetter (letter) {
        if(this.phrase.includes(letter)){
            return true;
        } else {
            return false;
        }
    }

    showMatchedLetter (clicked) {
//The gameObj instance will access this method if the correct key was pressed/ selected
        let div = document.getElementsByClassName(clicked.textContent);
        let array = Array.from(div); 
        array.forEach(li =>{
                li.classList.remove('hide')
                li.classList.add('show')
        })
    }
}