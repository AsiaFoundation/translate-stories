const mongoose = require('mongoose');

// a Checkout is a record that a User is looking at a Source
// this lets an admin check in on people who are currently drafting a translation
// or helps divide up labor, so more books get edited by fewer people

var checkoutSchema = mongoose.Schema({
  book_id: String,
  title: String,
  cover: String,
  user_id: String,
  user_name: String,
  started: Date,
  updated: Date,
  inlang: String,
  outlang: String
});

module.exports = mongoose.model('Checkout', checkoutSchema);
