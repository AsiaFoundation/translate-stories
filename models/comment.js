const mongoose = require('mongoose');

// a comment can be posted on the title or any page of a Source
// currently unable to detect and filter by language of comment

var commentSchema = mongoose.Schema({
  book_id: String,
  user_id: String,
  user_name: String,
  page: Number,
  text: String,
  date: Date
});

module.exports = mongoose.model('Comment', commentSchema);
