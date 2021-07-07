const showCase = document.querySelector('.showCase');

data.forEach( p => {
        var div = `<div id="project${p.id}">Project ${p.id}<br><span>${p.title}</span></div>`;
        showCase.insertAdjacentHTML('beforeend', div);
    }
);

document.querySelector('main').onload("projects/Project1_Random/index.html");
