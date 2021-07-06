// import depdendncies
var express = require('express');
var router = express.Router();

// import Book model from models directory; /models/index.js exports a module containing all model objects in the directory.
const {Book} = require('../models');

// Handler function that wraps around each route.
function asyncHandler(cb) {
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch (error) {
      res.status(500).send(error);
    }
  }
}


//redirected from home page url: /books... populates all books currently in database
//along with button leading to new book submission form page.
router.get('/', asyncHandler( async (req, res) => {
  const books = await Book.findAll({
    order: [
      ['year', 'DESC'],
      ['author', 'ASC'],
      ['title', 'ASC']
  ]
  });
  res.render('index', {books})
}));

//Redirected via button link: a form for inputting a new book into database
//You must pass book property containing empty object to satisfy template engine; necessary to make post route work.
router.get('/new', asyncHandler( async (req, res) => {
  res.render('new-book', {book: {}})
}))

//Post new book to the database
router.post('/new', asyncHandler(async (req, res) => {
  let book;
  try{
    book = await Book.create(req.body);
    console.log(book);
    res.redirect('/books');
  } catch (error) {
    if(error.name === "SequelizeValidationError") {
      // if a validation error is caught, book variable is rebuilt with the just submitted values taken from the req body.
      // the same pug template is re-rendered, but this time, instead of passing an empty book property into the pug template--
      // --said property contains the rejected submission data and an errs prop to trigger a rendering of the error messages in the template.
      book = await Book.build(req.body);
      let errs = error.errors
      res.render('new-book', {book, errs})
    } else {
      throw error;
    }
  }
  
}))

// selects a book to either update or delete
router.get('/:id', asyncHandler(async (req, res, next) => {
  const book = await Book.findByPk(req.params.id);
  if (book){
    res.render("update-book", {book})
  } else {
    const err = new Error('Page Not Found')
    err.status = 404;
    next(err);
  }
}))

//post request for updating a book
router.post('/:id', asyncHandler(async (req, res) => {
  let book;
  try{
    book = await Book.findByPk(req.params.id);
    if(book) {
      await book.update(req.body);
      res.redirect("/books");
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    if(error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      book.id = req.params.id;
      let errs = error.errors;
      res.render("update-book", {book, errs})
    } else {
      throw error;
    }
  }
}))

//post request to delete book
router.post('/:id/delete', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  await book.destroy();
  res.redirect("/books");
}))

module.exports = router;
