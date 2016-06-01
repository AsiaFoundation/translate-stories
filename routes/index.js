const Book = require('../models/book.js');
const api = require('./api.js');

function home (ctx) {
  ctx.render('app');
}

function book (ctx) {
  ctx.render('book', {
    csrfToken: ctx.csrf
  });
}

function epub (ctx) {
  ctx.render('epub', {
    target: 'EPUB'
  });
}

function epub2 (ctx) {
  ctx.render('epub', {
    target: 'EPUB-balloon'
  });
}

async function translate (ctx) {
  var body = ctx.request.body;
  var b = new Book({
    title: body.story_number,
    language: body.story_language,
    translator: body._subject,
    pages: body.story_translation
  });
  await b.save();
  ctx.redirect('/book');
}

module.exports = {
  home: home,
  book: book,
  epub: epub,
  epub2: epub2,
  translate: translate,
  api: api
};
