const Book = require('../models/book.js');
const api = require('./api.js');

function home (req, res) {
  res.render('app');
}

function book (req, res) {
  res.render('book', {
    csrfToken: req.csrfToken()
  });
}

function epub (req, res) {
  res.render('epub', {
    target: 'EPUB'
  });
}

function epub2 (req, res) {
  res.render('epub', {
    target: 'EPUB-balloon'
  });
}

function translate (req, res) {
  var body = req.body;
  var b = new Book({
    title: body.story_number,
    language: body.story_language,
    translator: body._subject,
    pages: body.story_translation
  });
  b.save(function(err) {
    if (err) {
      return res.json(err);
    }
    res.redirect('/book');
  });
}

module.exports = {
  home: home,
  book: book,
  epub: epub,
  epub2: epub2,
  translate: translate,
  api: api
};
