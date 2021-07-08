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
    if(data[id.slice(7)-1].displayable) {
        if(document.querySelector('iframe')){
            document.querySelector('iframe').src = "projects/"+id;
        } else {
            document.querySelector('#main').innerHTML = `<iframe src="projects/${id}"/>`
        }
    } else {
        document.querySelector('#main').textContent = "Sorry nothing to see here"

    }
}