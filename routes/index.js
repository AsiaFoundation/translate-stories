const Checkout = require('../models/checkout.js');
const Comment = require('../models/comment.js');
const Translation = require('../models/translation.js');

const api = require('./api.js');
const verify = require('./verify.js');
const login = require('./login.js');
const upload = require('./upload.js');
const library = require('./library.js');

function home (req, res) {
  res.render('app');
}

function book (req, res) {
  res.render('book', {
    csrfToken: req.csrfToken()
  });
}

function epub (req, res) {
  var book_id = 'EPUB';
  Comment.find({ book_id: book_id }).sort('page, -date').exec(function (err, comments) {
    if (err) {
      return res.json(err);
    }
    res.render('epub', {
      target: 'EPUB',
      book_id: book_id,
      comments: comments,
      userName: (req.user || {}).name,
      fromlang: req.query.from,
      tolang: req.query.to,
      csrfToken: req.csrfToken()
    });
  });
}

function epub2 (req, res) {
  var book_id = 'EPUB-balloon';
  Comment.find({ book_id: book_id }).sort('page, -date').exec(function (err, comments) {
    if (err) {
      return res.json(err);
    }
    res.render('epub', {
      target: 'EPUB-balloon',
      book_id: book_id,
      comments: comments,
      userName: (req.user || {}).name,
      fromlang: req.query.from,
      tolang: req.query.to,
      csrfToken: req.csrfToken()
    });
  });
}

function translate (req, res) {
  var body = req.body;
  if (!req.user) {
    req.user = { _id: '', name: '' };
  }
  var t = new Translation({
    book_id: body.book_id || body.story_number,
    title: body.md_title,
    language: body.story_language,
    translator: req.user.name,
    pages: JSON.parse(body.story_translation),
    user_id: req.user._id,
    verified: false
  });
  t.save(function(err) {
    if (err) {
      return res.json(err);
    }
    res.redirect('/library');
  });
}

module.exports = {
  home: home,
  book: book,
  epub: epub,
  epub2: epub2,
  verify: verify,
  translate: translate,
  api: api,
  login: login,
  upload: upload,
  library: library
};
