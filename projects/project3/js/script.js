// namefield id
const nameField = document.getElementById("name");
// Job role section ids
const otherJobRole = document.getElementById("other-job-role");
const jobRole = document.getElementById("title");
// T-shirt seection ids
const color = document.getElementById("color");
const design = document.getElementById("design");
// Activities section ids
const activities = document.getElementById("activities-box");
const activitiesCost = document.getElementById('activities-cost');
// Payment section ids
const paymentSelector = document.getElementById('payment');
const credit = document.getElementById('credit-card');
const paypal = document.getElementById('paypal');
const bitcoin = document.getElementById('bitcoin');


// Focuses on name field upon load
// Hides bitcoin and paypal options until selected 
// Makes Credit card payment the initial selected option
nameField.focus();
paypal.style.display = 'none';
bitcoin.style.display = 'none';
paymentSelector.selectedIndex = 1;

// event listener that changes payment details based on what payment method is selected.
const paymentDivId = ['credit-card', 'paypal', 'bitcoin'];
paymentSelector.addEventListener('change', event =>{
    let choice = event.target.selectedOptions[0].value;
    document.getElementById(choice).style.display = '';
    for (const id of paymentDivId){
        if (id !== choice) {
            document.getElementById(id).style.display = 'none';   
        }
    }
});

// Other job role diplay none unless other is chosen under job role selection.
// Event listener on job role selection manages display of other job role input.
otherJobRole.style.display = "none";
jobRole.addEventListener('change', (event) => {
   if (event.target.selectedOptions[0].value == 'other') {
       otherJobRole.style.display = 'unset';
   } else {
       otherJobRole.style.display = 'none';
   }
});

// Disables color selection until theme is selected; then disables options based on theme
color.disabled = true;
design.addEventListener('change', (event)=>{
    color.selectedIndex = 0;
    color.disabled = false;
    let target = event.target.selectedOptions[0].value;
    for(let i = 1; i < color.length; i++){
        if(target !== color[i].getAttribute("data-theme")){
            // In safari, selector hidden property and display styling are broken for dynamically added elements
            // for cross-browser compatibility, disable the non-options instead of hiding them
            // This is a 13 year old bug at the time of this code
            color[i].disabled = true;
        } else {
            color[i].disabled = false;
        }
    }
})

// 1. event listener for activities fieldset: calc total cost based on checked boxes
// 2. --and makes sure there are no overlaps by disabling conflicting inputs
let total = 0;
activities.addEventListener('change', (event) => {
    let target = event.target;
    if(target.tagName === 'INPUT'){
        let charge = parseInt(target.getAttribute('data-cost'));
        if (target.checked === true) {
            total += charge;
        } else {
            total -= charge;
        }
    }
    activitiesCost.innerHTML = `Total: $${total}`;
    
    // loop through activities to make sure there are no overlaps, disabling time conflicts, and un-disabling upon unchecking boxes
    if(target.getAttribute('name') !== 'all'){
        let time = target.getAttribute('data-day-and-time');
        let list = activities.querySelectorAll('input');
        if(target.checked === true){
            list.forEach(input => {
                if(input.getAttribute('data-day-and-time') === time){
                    input.disabled = true;
                }
            });
            // Make sure the selected option isn't disabled or you won't be able to uncheck it.
            target.disabled = false;
        } else {
            list.forEach(input => {
                if(input.getAttribute('data-day-and-time') === time){
                    input.disabled = false;
                }
            });
        }
    }
});

// form validation works by storing an array, {testResults}, of true/false values based on tests ran on each essential field 
// method collects all elements with the 'hint' class attribute and dynamically reveals or hides them based on results of test on submission.

document.querySelector('button[type=submit]').addEventListener('click', (event) => {
    // Resets all error/hint messages to be invisible.
    // converts htmlcollection to array for workability
    // Thanks Harpo --> https://stackoverflow.com/questions/222841/most-efficient-way-to-convert-an-htmlcollection-to-an-array
    let hints = Array.from(document.getElementsByClassName('hint'));
    hints.forEach((fix) => {
        fix.style.display = 'none'
    });

    // Conducts tests and pushes result into array.
    let testResults = [];
    let nameTest = regexValidation(nameField.value, '.+');
    let emailTest = regexValidation(document.getElementById('email').value, '[^ ]+@[^ ]+([.][a-z]+)$')
    let activitiesTest = total !== 0
    testResults.push(nameTest, emailTest, activitiesTest);
    if (paymentSelector.selectedOptions[0].value === 'credit-card') {
        let cardNumber = document.getElementById('cc-num').value;
        let cardNumberTest = regexValidation(cardNumber, '^[0-9]{13,16}$');
        let zipcode = document.getElementById('zip').value;
        let zipcodeTest = regexValidation(zipcode, '^[0-9]{5}$')
        let cvv = document.getElementById('cvv').value;
        let cvvTest = regexValidation(cvv, '^[0-9]{3}$')
        testResults.push(cardNumberTest, zipcodeTest, cvvTest);
    }
    // Reconciles the indices of false values/failed tests (if any exists) in testResults against the hint classed elements in 'hints'.
    // Shows hints based on false values, which directly correllates with array of hint classed elements {hints} now modified through slice method to match testResults length.
    if(testResults.includes(false)){
        event.preventDefault();
        hints = hints.slice(0, testResults.length);
        testResults.forEach((fix, index) => {
            if (!fix) {
                hints[index].style.display = 'unset';
                hints[index].parentElement.classList.add('not-valid');
                hints[index].parentElement.classList.remove('valid');
            } else {
                hints[index].style.display = 'none';
                hints[index].parentElement.classList.remove('not-valid');
                hints[index].parentElement.classList.add('valid');

            }
        });
    }
});

/**
 * Tests to see if a string fits a provided regex
 * @param {string} val The string value to be tested
 * @param {regular Expression} test 
 * @returns true or false
 */
function regexValidation(val, test){
    let regex = new RegExp(test)
    let result = regex.test(val)
    return result;
}

// Makes sure activities checkboxes are focused upon cursor activity

let activitiesOptions = activities.querySelectorAll('input');
activitiesOptions.forEach(input => {
    input.addEventListener('focus', () => input.parentElement.classList.add('focus'));
    input.addEventListener('blur', () => input.parentElement.classList.remove('focus'));
});

