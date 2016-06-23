const mongoose = require('mongoose');

var translationSchema = mongoose.Schema({
  book_id: String,
  title: String,
  language: String,
  pages: [String],
  translator: String,
  user_id: String,
  reviewed: Boolean,
  submitted: Date
});

module.exports = mongoose.model('Translation', translationSchema);
