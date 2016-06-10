const Book = require('../models/book.js');

function home (req, res) {
  if (!req.user) {
    return res.redirect('/login');
  }

  if (!req.user.canVerify) {
    return res.send('You must be an admin to verify translations.');
  }

  Book.find({ verified: { $ne: true } }, function (err, books) {
    if (err) {
      return res.json(err);
    }
    res.render('verify', {
      books: books
    });
  });
}

module.exports = {
  index: home
};
