let xhr = new XMLHttpRequest();
let data;
let galleryDiv = document.getElementById('gallery');

//calls api for 12 random profiles at launch of app. Only profiles of us, canadian, and australian nationalities are called.

xhr.onreadystatechange = function(){
    if(xhr.readyState === 4){
        data = JSON.parse(xhr.responseText)
        // Creates a div element containing prelim info for each profile...
        data.results.forEach(item => {
            let card = `<div class="card">
                            <div class="card-img-container">
                                <img class="card-img" src=${item.picture.large} alt="profile picture">
                            </div>
                            <div class="card-info-container">
                                <h3 id="${item.name.first} ${item.name.last}" class="card-name cap">${item.name.first} ${item.name.last}</h3>
                                <p class="card-text">${item.email}</p>
                                <p class="card-text cap">${item.location.city}, ${item.location.state}</p>
                            </div>
                        </div>`;
            // appending each div to the gallery div
            galleryDiv.insertAdjacentHTML('beforeend', card)
        })
        //Attaches a click e-listener to each childnode within the gallery div, essentially each profile
        //Calls createModal, a helper function to create a modal window based on the clicked profile, passing in
        //the index of the profile clicked as an argument.
        for(let card of galleryDiv.children){
            card.addEventListener('click', function(e){
                let item = e.currentTarget
                let arr = Array.from(galleryDiv.children)
                let index = arr.indexOf(item)
                createModal(index);
            })
        }
    }
}
xhr.open('GET', 'https://randomuser.me/api/?results=12&nat=us,ca,au')
xhr.send();

//creates a modal whenever a profile is clicked
// Based on index passed in, function access appropriate profile originally received in the API call and
// constructs a modal window for that profile with close button, and next and previous.
function createModal (index){
    let package = data.results[index]
    let location = package.location
    let rawCell  = package.cell.replace(/[^\d]/g, "")
    let curedCell = `(${rawCell.substring(0,3)}) ${rawCell.substring(3,6)}-${rawCell.substring(6)}`
    let dateObj = new Date(package.dob.date)
    let month = dateObj.getMonth()
    let day = dateObj.getDate()
    let year = dateObj.getFullYear()
    let dob = `${month}/${day}/${year}`
    let modalContainer = `<div class="modal-container">
                            <div class="modal">
                                <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                                <div class="modal-info-container">
                                    <img class="modal-img" src=${package.picture.large} alt="profile picture">
                                    <h3 id="${package.name.first} ${package.name.last}" class="modal-name cap">${package.name.first} ${package.name.last}</h3>
                                    <p class="modal-text">${package.email}</p>
                                    <p class="modal-text cap">${location.city}</p>
                                    <hr>
                                    <p class="modal-text">${curedCell}</p>
                                    <p class="modal-text">${location.street.number} ${location.street.name}, ${location.city}, ${location.state} ${location.postcode}</p>
                                    <p class="modal-text">Birthday: ${dob}</p>
                                </div>
                            </div>
                            <div class="modal-btn-container">
                                <button type="button" id="modal-prev" class="modal-prev btn" onclick='prevModal(${index})'>Prev</button>
                                <button type="button" id="modal-next" class="modal-next btn" onclick='nextModal(${index})'>Next</button>
                            </div>
                        </div>`
                        
                        //modal-container's css background color has been personalized to purple.
    
    // Inserts the modal window after it's been constructed.
    galleryDiv.insertAdjacentHTML('afterend', modalContainer)
    // Makes sure the close button in the modal closes the modal when clicked.
    document.getElementById('modal-close-btn').addEventListener('click', (e)=>{
        let parent = document.querySelector('div.modal-container')
        parent.remove()
    })
}

//next modal function
// Based on current index arg, index will increment and retrieve appropriate profile, 
//invoking createModal helper function until limit is reached.
function nextModal(index){
    if (index < 11){
        let parent = document.querySelector('div.modal-container')
        parent.remove()
        createModal(index+1)
    }
}
//prev modal function 
function prevModal(index){
    if (index > 0){
        let parent = document.querySelector('div.modal-container')
        parent.remove()
        createModal(index-1)
    }
}

// search bar 
document.getElementById('search-submit').addEventListener('click', (e)=>{
   // prevents the enter key from reloading screen.
    e.preventDefault()
    let query = document.getElementById('search-input').value
    let regex = new RegExp(query,'i')
    let info = Array.from(document.querySelectorAll('h3.card-name.cap'))
    // filters through the current gallerydiv's childnodes, checking to see if the query matches their ids match with the query
    let matches = info.filter(function(item){
        let id = item.id
        return id.match(regex)
    })
    
    //hide everything
    for(let card of galleryDiv.children){
        card.style.display = 'none'
    }
    //show the matches
    for(let match of matches){
        match.parentElement.parentElement.style.display = ""
    }
    // searching an empty query will reveal all 12 profiles.
})