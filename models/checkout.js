const mongoose = require('mongoose');

var checkoutSchema = mongoose.Schema({
  book_id: String,
  title: String,
  cover: String,
  user_id: String,
  started: Date,
  updated: Date,
  inlang: String,
  outlang: String,
  comments: [String]
});

module.exports = mongoose.model('Checkout', checkoutSchema);
