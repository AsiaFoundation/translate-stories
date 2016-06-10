const mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  googid: String,
  name: String,
  test: Boolean,
  localpass: String,
  salt: String,
  canVerify: Boolean,
  preferredLanguage: String,
  readLanguages: [String],
  writeLanguages: [String]
});

module.exports = mongoose.model('User', userSchema);
