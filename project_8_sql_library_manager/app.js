// import project dependencies
var express = require('express');
var path = require('path');

// define route paths 
var homeRouter = require('./routes/index');
var booksRouter = require('./routes/books');

// create the app for use
var app = express();

// sets up view engine: designating folder where all templates live and specifying pug as the engine.
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// allows app to parse incoming request object; form submission data won't be passed into templates without it.
app.use(express.urlencoded({ extended: false }));

//import sequelize instance, which serves as connection to library db
const {sequelize} = require('./models');

// test connection status and sync db for operations
(async  () => {
  try {
    //test connection to db
    await sequelize.authenticate();
    console.log("SUCCESSFUL CONNECTION!")
  } catch (error) {
    console.error("CONNECTION FAILED!")
  }

  // Syncing sequelize instance and all models with library db and tables; just don't force sync...
  sequelize.sync();

})()



// sets up static files to help render initial findAll results, pagination, and search filters
app.use(express.static(path.join(__dirname, 'public')));

// configure app to use the routers for when users visit the app.
app.use('/', homeRouter);
app.use('/books', booksRouter);

// Browser keeps throwing 404 errors trying to get stylesheets and favicon; apparently this is a less than stellar feature of express...
// Catching these actions and silencing them before they trigger a console log; altering their statuses to 204 instead of 404, which won't throw an error.
// citation: https://stackoverflow.com/questions/35408729/express-js-prevent-get-favicon-ico
app.get('/favicon.ico', (req, res) => res.status(204));
app.get('/stylesheets/style.css', (req, res) => res.status(204));

// catch 404 and forward to error handler
app.use((req, res, next)=>{
  const err = new Error('Page Not Found');
  err.status = 404;
  next(err);
})

// global error handler
app.use((err, req, res, next)=>{
  if (err.status !== 404){
      err.status = err.status || 500
      err.message = (err.message || "Sorry! There was an unexpected error on the server.")
      console.log(err.status, err.message);
      res.render('error', {error: err})
  } else {
      console.log(err.status, err.message)
      res.render('page-not-found', {error: err})
  }
})

module.exports = app;
