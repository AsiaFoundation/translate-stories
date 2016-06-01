const Book = require('../models/book.js');

async function books(ctx) {
  var myBookData = await Book.find();
  ctx.body = myBookData;
}

module.exports = {
  books: books
};
