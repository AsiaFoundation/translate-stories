const mongoose = require('mongoose');

var bookSchema = mongoose.Schema({
  title: String,
  language: String,
  pages: String,
  translator: String,
  user_id: String
});

module.exports = mongoose.model('Book', bookSchema);
