'use strict';
// import library and routers
const express = require('express');

const {User, Course} = require('./models');
const authenticateUser = require('./middleware/auth-user.js');

const router = express.Router();

// Handler helper function for async operations
function asyncHandler(cb) {
    return async (req, res, next) => {
      try {
            await cb(req, res, next);
      } catch (error) {
            // Forward error to the global error handler
            next(error);
        }
    }
}

// Route that returns list of users
// authenticated to make sure user only gets his/her information when making a request
router.get('/users', authenticateUser, asyncHandler(async (req, res) => {
    const user = await req.currentUser;
    res.status(200).json(user);
}));

// Route that creates a new user. No authentication needed; unique email required as specified in model 
router.post('/users', asyncHandler(async (req, res) => {
  // try to create the user with the supplied info
  try {
    // assuming all info submitted meets validation requirements, respond with 201 status and end operation...
    await User.create(req.body);
    res.status(201).location('/').end();
  } catch (error) {
  // other wise...  
  // checks to see if the error caught is a validation error based on model's requirements.
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors }); 
    } else {
      // if the error isn't a validation error, then it's a developer problem, not a user input issue
      res.status(500).json(error);
      throw error;
    }
  }
}));

// course route that returns all courses; no authentication needed
// filters out created and updated timestamps
// since the search also returns the user who owns the course, filter out his/her password as well as his/h timestamps
router.get('/courses', asyncHandler(async (req, res) => {
  const results = await Course.findAll({
    attributes:{exclude: ['createdAt', 'updatedAt']},
    include: [
      {
        model: User,
        as: 'user',
        attributes:{exclude: ['createdAt', 'updatedAt', 'password']}
      }
    ]
  });
  res.status(200).json(results);
}))

// course route that returns a specified course
// mostly same as general courses get request...
router.get('/courses/:id', asyncHandler(async (req, res) => {
  const result = await Course.findOne({
    attributes: {exclude: ['createdAt', 'updatedAt']},
    include: [
      {
        model: User,
        as: 'user',
        attributes:{exclude: ['createdAt', 'updatedAt', 'password']}
      }
    ],
    where: {
      id: req.params.id
    }
  });

  // if course exists...
  if(result){
    res.status(200).json(result);
  } else{
    // otherwise send response with message
    res.status(404).json({message: "Course not found"});
  }

}))

// course route that creates a new course; authentication needed
router.post('/courses', authenticateUser, asyncHandler(async (req, res) => {
  // create a course variable
  let course;
  
  try{
    // makes sure the poster is in the system first; auth-user will throw error if not authenticated
    const user = await req.currentUser;
    
    // Authenticated? Great, now program will automatically assign the course to the user who wants to create the course if the userId input had been left out.
    // User may assign the course to another's id if he chooses.
    if(!req.body.userId) { 
      req.body.userId = user.id;  
    } 

    // proceed with creating the course
    course = await Course.create(req.body);
    // if course is successfully created, set uri location header and respond with 201 status...
    let id = course.id;
    res.location(`/api/courses/${id}`);
    res.status(201).end();  
  } 
  catch (error) {
    // check if the error is a validation error and not a developer problem
    // if it's a user input issue, validate if entered information matches validaton requirements
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors }); 
    } else {
      // Uh oh... it's a developer problem
      res.status(500).json(error);
      throw error;
    }
  }
}))

// course route that updates an existing course; authentication required
router.put('/courses/:id', authenticateUser, asyncHandler(async(req, res) =>{
  // First, check to see if user is in the system first; auth-user will throw error if you're not logged in
  const user = await req.currentUser;

  // If you're in the system, program will find course based on query id; will return null if not found
  const course = await Course.findByPk(req.params.id);
  
  // if course exists, proceed... or respond with 400 error, message; Course not found
  if (course){
    // Looks like the course exists; check if user is owner of course, or if the course isn't being owned by anyone...
    // Reminder: once course's userId has been assigned to a user... only that user may edit, or transfer the course by setting userId to another's
    if(course.dataValues.userId == user.dataValues.id || !course.dataValues.userId){
      // Looks like the user has the right to modify course
      try{
        // Proceed with updating course
        await course.update(req.body);
        res.status(204).end();
      } catch (error) {
        // Looks like error arose; check if it's a validation error and not a developer problem
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
          const errors = error.errors.map(err => err.message);
          res.status(400).json({ errors }); 
        } else {
          // Looks like it's a developer problem.
          res.status(500).json(error);
          throw error;
        }
      }
    } else {
      // user shouldn't have gotten this far based on how ui was set up, but in case they/hackers have...
      res.status(403).json({message: "User is not owner of course"})
    }  
  } else {
    // user must have fiddled with url, trying to find a nonexistent course
    res.status(400).json({message: "Course Not Found"});
  }
}))

// course route that deletes an existing course; authentication needed
router.delete('/courses/:id', authenticateUser, asyncHandler(async(req, res)=>{
  //checks to see if user is in the system
  const user = await req.currentUser;
  //finds course based on query id
  const course = await Course.findByPk(req.params.id);

  // checks if course exists before proceeding
  if (course) {
    // checks if user owns course or if course isn't being owned by anyone before it can be deleted
    if(course.dataValues.userId == user.dataValues.id || !course.dataValues.userId){
      await course.destroy();
      res.status(204).end();
    } else {
      res.status(403).json({message: "User is not owner of course"})
    }
  } else {
    res.status(400).json({message: "Course Not Found"})
  }
}))

module.exports = router;