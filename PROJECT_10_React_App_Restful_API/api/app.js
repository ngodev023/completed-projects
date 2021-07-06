'use strict';

// load modules
const express = require('express');
const morgan = require('morgan');
const routes = require('./routes');
const {sequelize, Course} = require('./models');
const cors = require('cors');
//const courseModel = require('./models').Course;

// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// create the Express app
const app = express();

// enable cors
app.use(cors({
  exposedHeaders:['Location']
}));

// Setup request body JSON parsing.
app.use(express.json());

// setup morgan which gives us http request logging
app.use(morgan('dev'));

// setup a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});

// api routes handling
app.use('/api', routes);

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});


// sync models and authenticate connection
(async () => {

  try{
    await sequelize.authenticate()
    console.log('Connection to DataBase Successful')
  } catch (error) {
    console.log('ERROR: Connection was unsuccessful')
  }
  
  await sequelize.sync();
})();


// set our port
app.set('port', 5000);


  // start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});

