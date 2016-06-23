const Translation = require('../models/translation.js');

function home (req, res) {
  if (!req.user) {
    return res.redirect('/login');
  }

  if (!req.user.canVerify) {
    return res.send('You must be an admin to verify translations.');
  }

  Translation.find({ language: { $in: req.user.readLanguages }, verified: { $ne: true } }, function (err, translations) {
    if (err) {
      return res.json(err);
    }
    res.render('verify', {
      translations: translations
    });
  });
}

module.exports = {
  index: home
};
