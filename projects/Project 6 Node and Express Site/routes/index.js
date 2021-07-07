const express = require('express');
const router = express.Router();
const {projects} = require('../data.json');

// render homepage
router.get('/', (req, res)=>{
    res.render('index', {projects})
})

//render about page
router.get('/about', (req, res)=>{
    res.render('about')
})

router.get('/project/:id', (req, res, next)=>{
// checks if id matches any project array index before executing
    if(projects[req.params.id]){
        const projectId = parseFloat(req.params.id)
        const project = projects[projectId]
        res.render('project',{project})
    } else {
        // will display custom error if user tries to access a project that doesn't exist... yet.
        const err = new Error();
        err.status = 404;
        err.message = `Currently, there are only ${projects.length} project(s) to display.`
        next(err);
    }
})

// Custom error; doesn't generate status code, which will automatically be allocated to 500 in handler function
router.get('/customerror',(req, res, next)=>{
    const err = new Error();
    next(err)
})


module.exports = router;