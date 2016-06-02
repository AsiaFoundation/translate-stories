const mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  googid: String,
  name: String,
  test: Boolean,
  localpass: String,
  salt: String
});

module.exports = mongoose.model('User', userSchema);
