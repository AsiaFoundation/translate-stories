const mongoose = require('mongoose');

var bookSchema = mongoose.Schema({
  book_id: String,
  title: String,
  language: String,
  pages: String,
  translator: String,
  user_id: String,
  verified: Boolean
});

module.exports = mongoose.model('Book', bookSchema);
