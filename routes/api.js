const Book = require('../models/book.js');

function books(req, res) {
  Book.find({}).exec(function (err, myBookData) {
    if (err) {
      return res.json(err);
    }
    res.json(myBookData);
  });
}

function book(req, res) {
  Book.find({ book_id: req.params.id }).exec(function(err, myBookData) {
    if (err) {
      return res.json(err);
    }
    res.json(myBookData);
  });
}

module.exports = {
  books: books,
  book: book
};
