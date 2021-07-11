const showCase = document.querySelector('.showCase');

data.forEach( (p, index) => {
        var div = `<div id="project${index+1}"><span>Project ${index+1}<br>${p.title}</span></div>`;
        showCase.insertAdjacentHTML('beforeend', div);
        showCase.lastElementChild.addEventListener('click', viewClick);
    }
);


showCase.scrollTo(showCase.scrollWidth,0);
showCase.children[showCase.children.length-1].classList.add("viewing");

function viewClick (e) {
    document.querySelector('.viewing')?.classList.remove('viewing');
    if (e.target.nodeName === 'DIV') {
        e.target.classList.add("viewing");
        handleScreen(e.target.id);
    } else if (e.target.nodeName === 'SPAN') {
        e.target.parentNode.classList.add("viewing");
        handleScreen(e.target.parentNode.id)
    } else if (e.target.nodeName === 'BR') {
        e.target.parentNode.parentNode.classList.add("viewing");
        handleScreen(e.target.parentNode.parentNode.id);
    }
}

function handleScreen (id) {
    let realId = data[id.slice(7)-1];
    if(realId.displayable) {
        if(document.querySelector('iframe')){
            document.querySelector('iframe').src = realId.host;
            populateDetails(realId);
        } else {
            document.querySelector('#main').innerHTML = `<h3 id="loading">Loading</h3><iframe onload="loaded()" src="${realId.host}"></iframe>`;
            populateDetails(realId);
        }
    } else {
        document.querySelector('#main').textContent = "Sorry, there's nothing to display at the moment... See Details for more information.";
        document.getElementById('sidebar').innerHTML = `
        <h3>Details</h3>
        Name: ${realId.title}
        <div style="border: none;">
            <p>${realId.details.message}</p>
        </div>
        <button class="sourceBtn" style="background: green;"><a target="_blank" href=${realId.host}>Live Link</a></button>
        <button class="sourceBtn"><a target="_blank" href="${realId.details.sourceCode}">Source Code</a></button>
        `;
    }
}

function populateDetails(data){
    let sideBar = document.getElementById('sidebar');
    let detailBlock = `
        <h3>Details</h3>
        Name: ${data.title}
        <div style="border: none;">
            <p>${data.details.message}</p>
        </div>
        <button class="sourceBtn" style="background: green;"><a target="_blank" href=${data.host}>Live Link</a></button>
        <button class="sourceBtn"><a target="_blank" href=${data.details.sourceCode}>Source Code</a></button>
        `;
    sideBar.innerHTML = detailBlock;
}

populateDetails(data[9]);