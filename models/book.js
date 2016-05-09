const mongoose = require('mongoose');

var bookSchema = mongoose.Schema({
  title: String,
  language: String,
  pages: String,
  translator: String
});

module.exports = mongoose.model('Book', bookSchema);
