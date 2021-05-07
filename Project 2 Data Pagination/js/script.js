/*
Treehouse Techdegree:
FSJS Project 2 - Data Pagination and Filtering
*/

/*
For assistance:
   Check out the "Project Resources" section of the Instructions tab: https://teamtreehouse.com/projects/data-pagination-and-filtering#instructions
   Reach out in your Slack community: https://treehouse-fsjs-102.slack.com/app_redirect?channel=unit-2
*/

/*
Create the `showPage` function
This function will create and insert/append the elements needed to display a "page" of nine students
*/
function showPage(list, page=1){
   const startIndex = (page*9) - 9;
   const endIndex = page*9;
   const studentList = document.querySelector('ul.student-list');
   studentList.innerHTML = '';
   for(let item of list){
      if(list.indexOf(item) >= startIndex && list.indexOf(item) < endIndex){
         let li = document.createElement('li');
            li.classList.add('student-item', 'cf'); 

         let studentDetailDiv = document.createElement('div');
            studentDetailDiv.classList.add('student-details');
         let mugshot = document.createElement('img');
            mugshot.classList.add('avatar');
            mugshot.setAttribute('src', item.picture.large);
            mugshot.setAttribute('alt', "Profile Picture")
         let fullName = document.createElement('h3');
            fullName.innerHTML = item.name.first +" "+item.name.last;
         let email = document.createElement('span');
            email.classList.add('email');
            email.innerHTML = item.email;
         studentDetailDiv.appendChild(mugshot)
         studentDetailDiv.appendChild(fullName)
         studentDetailDiv.appendChild(email);

         let joinDetailDiv = document.createElement('div');
            joinDetailDiv.classList.add('joined-details');
         let joinDate = document.createElement('span');
            joinDate.classList.add('date');
            joinDate.innerHTML = "Joined "+item.registered.date;
         joinDetailDiv.appendChild(joinDate);

         li.appendChild(studentDetailDiv);
         li.appendChild(joinDetailDiv);
         
         studentList.appendChild(li);
      }
   }
}

/*
Create the `addPagination` function
This function will create and insert/append the elements needed for the pagination buttons
*/

function addPagination(list){
   let totalPages = Math.ceil(list.length/9);
   let linkList = document.querySelector('ul.link-list');
   linkList.innerHTML = '';

   for(let page = 1; page <= totalPages; page++){
      let li = document.createElement('li');
      let pageBtn = document.createElement('button');
      pageBtn.setAttribute('type', 'button');
      pageBtn.innerHTML = page;
      li.appendChild(pageBtn);
      linkList.appendChild(li);
   }
   linkList.children[0].children[0].classList.add('active');

   linkList.addEventListener('click', function(e){
      if(e.target.type === "button") {
         let clickedPage = e.target.innerHTML;
         showPage(list, clickedPage);
         // removes 'active' class from all page links that have it; there should be only 1
         linkList.childNodes.forEach(item => item.childNodes[0].classList.remove('active'))
         // gives the clicked page the 'active' class, which decorates it in blue.
         e.target.classList.add('active')
      }
   })
}

// Dynamically populates a search field next to the header, along with a search button.
// Provided by TreeHouse instructional guideline.
document.querySelector('h2').insertAdjacentHTML('afterend', `<label for="search" class="student-search">
<span>Search by name</span>
<input id="search" placeholder="Search by name...">
<button type="button"><img src="img/icn-search.svg" alt="Search icon"></button>
</label>`) 

/**
 * This function takes a query input and filters through the data array, returning a new array of obj profiles by way of a regular expression
 * This function then populates a new body display with those filtered results 
 * "No result" is shown if filtered array's length returns 0 results.
 * This function is only invoked by event listeners.
 */
function filterBar() {
   let searchQuery = new RegExp(document.getElementById('search').value, 'i')
   let filteredData = data.filter(element => {
      if(searchQuery.test(element.name.first) || searchQuery.test(element.name.last)) {
         return element
      }
   })
   //If there is 1 or more results, page will display it/them
   if(filteredData.length > 0){
      showPage(filteredData)
      addPagination(filteredData)
   } else {
      //Page will clear itself of links if there are no results
      document.querySelector('ul.student-list').innerHTML = "No results found"
      document.querySelector('ul.link-list').innerHTML = ""
   }
}

// The following is an event lister wired to the search button; clicking will activate filter.
document.querySelector('label.student-search button').addEventListener('click', filterBar)

// The following is a shortcut event listener wired to keyboard inputs, enter and backspace...
// The Enter key while in the input field will activate filter.
// Clearing the input field with backspace returns all the original data results, unfiltered
document.getElementById("search").addEventListener('keyup', (e) => {
   let input = document.getElementById("search").value
   if(e.key === 'Enter'){
      filterBar();
   } else if (e.key === 'Backspace' && input === ''){
      showPage(data)
      addPagination(data)
   }
})

// Call functions
showPage(data)
addPagination(data)
