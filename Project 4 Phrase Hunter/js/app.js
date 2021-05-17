/* Treehouse FSJS Techdegree
 * Project 4 - OOP Game App
 * app.js */

 
// Declares a gameObj.
let gameObj;

// This button element doubles as a start game and reset button.
// Initiating a Game instance; gets overwritten each time it's clicked.
document.getElementById('btn__reset').addEventListener('click', function(){
    gameObj = new Game();
    gameObj.startGame();
})

// The onscreen keyboard will have an e listener attached to the outer-overall div
// But will only allow the gameObj to respond if an actual key(a button element) was the target.
document.getElementById('qwerty').addEventListener('click', function(event){
    let target = event.target;
    if(target.nodeName === 'BUTTON' && target.className === "key"){
        gameObj.handleInteraction(target)
    }
})

// This e-listener checks for keystrokes from the keyboard, then sees if the key value matches with
// any of the onscreen keyboard key values before letting the gameObj take action.
// Essentially, only letter keys from the keyboard will have any effect. 
window.addEventListener('keydown', function(event){
   if(document.getElementById('overlay').style.display == 'none'){
        let qwerty = Array.from(document.getElementsByClassName('key'))
        let stroke = qwerty.filter(item => item.textContent === event.key)
        if(stroke[0] !== undefined){
            if(!stroke[0].disabled){
                gameObj.handleInteraction(stroke[0])
            }
        }
   }
})

// Personal touch: changing background color ever 3 seconds... for distractions.
// setInterval(()=>{
//     let bgColor = `rgb(${Math.floor(Math.random()*256)},${Math.floor(Math.random()*256)},${Math.floor(Math.random()*256)})`
//     document.body.style.backgroundColor = bgColor
// }, 3000)