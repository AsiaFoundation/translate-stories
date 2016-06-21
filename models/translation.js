const mongoose = require('mongoose');

var translationSchema = mongoose.Schema({
  book_id: String,
  title: String,
  language: String,
  pages: String,
  translator: String,
  user_id: String,
  verified: Boolean
});

module.exports = mongoose.model('Translation', translationSchema);
