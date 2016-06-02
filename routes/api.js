const Book = require('../models/book.js');

function books(req, res) {
  Book.find({}).exec(function (err, myBookData) {
    if (err) {
      return res.json(err);
    }
    res.json(myBookData);
  });
}

module.exports = {
  books: books
};
