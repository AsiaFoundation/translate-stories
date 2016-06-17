const mongoose = require('mongoose');

var sourceSchema = mongoose.Schema({
  book_id: String,
  title: String,
  author: String,
  languages: [String],
  pages: [String],
  file: String
});

module.exports = mongoose.model('Source', sourceSchema);
