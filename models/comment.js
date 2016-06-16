const mongoose = require('mongoose');

var commentSchema = mongoose.Schema({
  book_id: String,
  user_id: String,
  user_name: String,
  page: Number,
  text: String,
  date: Date
});

module.exports = mongoose.model('Comment', commentSchema);
