const express = require('express');
const data = require('./data.json');
const routes = require('./routes/index.js')

const app = express();
app.set('view engine', 'pug')
app.use('/static', express.static('public'))

app.use(routes)

// handles unfound urls: 404 error status setter
app.use((req, res, next)=>{
    const err = new Error('The page you are looking for does not exist!');
    err.status = 404;

    next(err);
})

// Global Error handler
app.use((err, req, res, next)=>{
    if (err.status !== 404){
        err.status = err.status || 500
        err.message = (err.message || "Oops! Something went wrong. Contact Support.")
        console.log(err.status, err.message);
        res.render('error', {error: err})
    } else {
        console.log(err.status, err.message)
        res.render('page-not-found', {error: err})
    }
})

app.listen(3000, ()=>{
    console.log("The app is running at port 3000.")
})