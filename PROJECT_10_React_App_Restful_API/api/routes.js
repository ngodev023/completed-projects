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
// authenticated to make sure user only gets his/her information
router.get('/users', authenticateUser, asyncHandler(async (req, res) => {
    const user = await req.currentUser;
    res.status(200).json(user);
}));

// Route that creates a new user.
router.post('/users', asyncHandler(async (req, res) => {
  try {
    await User.create(req.body);
    res.status(201).location('/').end();
  } catch (error) {

  // validates if entered information matches validaton requirements
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors }); 
    } else {
      res.status(500).json(error);
      throw error;
    }
  }
}));

// course route that returns all courses
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

// course route that creates a new course
router.post('/courses', authenticateUser, asyncHandler(async (req, res) => {
  
  let course;
  // makes sure the poster is in the system first.
  try{
    const user = await req.currentUser;
    // automatically assign the course to the user who created the course
    // if the userId had been left out.
    if(!req.body.userId) { 
      req.body.userId = user.id;
      
    } 
      course = await Course.create(req.body);
      // if course is successfully created, set uri location header.
      let id = course.id;
      res.location(`/courses/${id}`);
      res.status(201).end();
    
  } 
  catch (error) {
    // validates if entered information matches validaton requirements
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors }); 
    } else {
      res.status(500).json(error);
      throw error;
    }
  }
}))

// course route that updates an existing course.
router.put('/courses/:id', authenticateUser, asyncHandler(async(req, res) =>{
  // checks to see if user is in the system first.
  const user = await req.currentUser;
  // finds course based on query id
  const course = await Course.findByPk(req.params.id);
  
  // if course exists, proceed...
  if (course){
    // checks if user is owner of course, or if the course isn't being owned by anyone, proceed...
    // once course's userId has been assigned to a user... only that user may edit, or disown the course by setting 
    // userId's value to null
    if(course.dataValues.userId == user.dataValues.id || !course.dataValues.userId){
      try{
        await course.update(req.body);
        res.status(204).end();
        
      } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
          const errors = error.errors.map(err => err.message);
          res.status(400).json({ errors }); 
        } else {
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

// course route that deletes an existing course.
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

//THIS IS IN PROJECT 10 COPY