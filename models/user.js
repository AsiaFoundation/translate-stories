const mongoose = require('mongoose');

// users using PassportJS for authentication
// currently storing readLanguages and writeLanguages as separate arrays, but they could be unified
// depends on our practical needs

var userSchema = mongoose.Schema({
  googid: String,
  name: String,
  test: Boolean,
  photo: String,
  localpass: String,
  salt: String,
  canVerify: Boolean,
  preferredLanguage: String,
  readLanguages: [String],
  writeLanguages: [String]
});

module.exports = mongoose.model('User', userSchema);
