var express = require('express');
var router = express.Router();
var {Book} = require('../models');

// Book model imported, all books logged into console, then redirected to books route
router.get('/', async (req, res)=> {
  const allBooks = await Book.findAll();
  console.log(allBooks);
  res.redirect('/books');
})

// Custom Error route to evoke a 500 status response
router.get('/customerror',(req, res, next)=>{
  const err = new Error();
  next(err)
})

module.exports = router;
