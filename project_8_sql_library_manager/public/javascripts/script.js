// populates books table with results from db
function showPage(list, page=1){
    const startIndex = (page*5) - 5;
    const endIndex = page*5;
    const bookList = document.getElementById('bookList');
    bookList.innerHTML = '';
    
    for(let item of list){
       if(list.indexOf(item) >= startIndex && list.indexOf(item) < endIndex){
           let tr = document.createElement('tr');
           let book = `
           <td><a href="/books/${item.id}">${item.title}</a></td>
           <td>${item.author}</td>
           <td>${item.genre}</td>
           <td>${item.year}</td>`;
           tr.innerHTML = book;
          bookList.insertAdjacentElement('beforeend', tr);
       }
    }
 }
 // calls the function to populate all books
 showPage(list);

 // adds pagination buttons 
function addPagination(list){
    let totalPages = Math.ceil(list.length/5);
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
// calls pagination to render at bottom of div element
 addPagination(list)

 // SEARCH mechanism

 function filterBar() {
    let searchQuery = new RegExp(document.getElementById('search').value, 'i')
    let filteredData = list.filter(element => {
       if(searchQuery.test(element.title) || searchQuery.test(element.author) || searchQuery.test(element.genre) || searchQuery.test(element.year.toString())) {
          return element
       }
    })
    //If there is 1 or more results, page will display it/them
    if(filteredData.length > 0){
       showPage(filteredData)
       addPagination(filteredData)
    } else {
       //Page will clear itself of book entries if there are no results
       document.getElementById('bookList').innerHTML = "No results found"
       document.querySelector('ul.link-list').innerHTML = ""
    }
 }
 
 // The following is an event lister wired to the search button; clicking will activate filter.
 document.getElementById('search-button').addEventListener('click', filterBar);

 // pressing enter key will also activate search filter
 document.getElementById("search").addEventListener('keyup', (e) => {
   let input = document.getElementById("search").value
   if(e.key === 'Enter'){
      filterBar();
   }
})
 