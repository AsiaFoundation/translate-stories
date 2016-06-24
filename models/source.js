const mongoose = require('mongoose');

// a source is an uploaded EPUB
// I haven't been able to properly open a zipped EPUB with ReadiumJS, so we might need to unzip the file first
// then the "book_id" field would be a path to the unzipped folder

var sourceSchema = mongoose.Schema({
  book_id: String,
  title: String,
  cover: String,
  author: String,
  languages: [String],
  pages: [String],
  file: String
});

module.exports = mongoose.model('Source', sourceSchema);
