/******************************************
Treehouse FSJS Techdegree:
project 1 - A Random Quote Generator
******************************************/

// For assistance: 
  // Check the "Project Resources" section of the project instructions
  // Reach out in your Slack community - https://treehouse-fsjs-102.slack.com/app_redirect?channel=chit-chat

/*** 
 * `quotes` array 
 * 
 * This array literal contains the repository for all the quotes to be used in the rand-quote generator: Each indexed object contains a quote, source, citation, and year.
 * Purpose: supply the getRandomQuote function.
***/
let quotes = [{quote: "Frankly, my dear, I don't give a damn.",
               source: "Clark Gable",
               citation: "Gone With The Wind",
               year: 1939
              },
              {quote: "Our greatest glory is, not in never falling, but in rising every time we fall.",
               source: "Oliver Goldsmith",
               citation: "The Vicar of Wakefield",
               year: 1762
              },
              {quote: "Here's looking at you, kid.",
               source: "Humphrey Bogart",
               citation: "Casablanca",
               year: 1942
              },
              {quote: "The voyage of the best ship is a zigzag line of a hundred tacks.",
               source: "Ralph Waldo Emerson",
               citation: "Self-Reliance",
               year: "1950's"
              },
              {quote: "That's one small step for man, one giant leap for mankind.",
               source: "Neil Armstrong",
               citation: "Apollo 11",
               year: 1969
              },
              {quote: "Many of life's failures are people who did not realize how close they were to success when they gave up.",
               source: "Thomas Edison",
               citation: "From Telegraph to Light Bulb with Thomas Edison",
               year: 1877
              },
              {quote: "Float like a butterfly, sting like a bee.",
               source: "Muhammad Ali",
               citation: "Heavyweight Championship",
               year: 1964
              },
              {quote: "I have never let my schooling interfere with my education.",
               source: "Mark Twain",
               citation: "Ad-A Daisy Air Rifle",
               year: 1907
              },
              {quote: "When I'm good, I'm very good. When I'm bad, I'm better.",
               source: "Mae West",
               citation: "I'm No Angel",
               year: 1933
              },
              {quote: "It is a time for martyrs now, and if I am to be one, it will be for the cause of brotherhood. That's the only thing that can save this country.",
               source: "Malcolm X",
               citation: "Crowd speech",
               year: "Feb. 19, 1965"
              }
            ]


/***
 * `getRandomQuote` function
 * 
 * this function RETURNS a random quote(an object literal, which contains quote, source, etc.) from the quotes array.
 * Mechanic: Generates a random integer between 0 and the quotes array's length, and then uses it as an index to pull a random quote object from the array.
***/
let getRandomQuote = () =>  quotes[Math.floor(Math.random() * quotes.length)];

/***
 * `printQuote` function
 * 
 * this function invokes getRandomQuote(), which returns a random object from the quotes array.
 * this function then takes an html element by the id of 'quote-box' and changes its innerHTML content using information from the random object it just pulled.
***/

function printQuote () {
  let quoteObject = getRandomQuote();
  let quoteBox = document.getElementById('quote-box');
  quoteBox.innerHTML= `<p class="quote">${quoteObject.quote}</p>
  <p class="source">${quoteObject.source}<span class="citation">${quoteObject.citation}</span><span class="year">${quoteObject.year}</span></p>`;
  // let bgColor = `rgb(${Math.floor(Math.random()*256)},${Math.floor(Math.random()*256)},${Math.floor(Math.random()*256)})`
  // document.body.style.backgroundColor = bgColor
}

/**
 * This array of interval ids is used to store the ids needed to clear the intervals.
 */
var intervalIDs = [];

/**
 * This function clears any active intervals, if they exist, then calls printQuote on a loop--
 * every ten seconds, storing the id in the intervalIDs array: which will be needed to reset the loop
 * --each time the 'Show another quote' button is clicked.
 */
function loop () {
  clearInterval(intervalIDs[0])
  intervalIDs.pop()
  printQuote();
  var intervalID = setInterval(printQuote, 10000)
  intervalIDs.unshift(intervalID);
}


/***
 * click event listener for the print quote button
 * DO NOT CHANGE THE CODE BELOW!!
 * This code attaches an event listener to an html element id'd as 'load-quote'; upon click, element will call loop(), which in turn will call upon printQuote(), which begets getRandomQuote(),
 *  --and present a new, random quote and its accompanying details to the html body.
***/

loop();

document.getElementById('load-quote').addEventListener("click", loop, false);