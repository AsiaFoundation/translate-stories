'use strict';

let translate = (() => {
  var ref = _asyncToGenerator(function* (ctx) {
    var body = ctx.request.body;
    var b = new Book({
      title: body.story_number,
      language: body.story_language,
      translator: body._subject,
      pages: body.story_translation
    });
    yield b.save();
    ctx.redirect('/book');
  });

  return function translate(_x) {
    return ref.apply(this, arguments);
  };
})();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const Book = require('../models/book.js');
const api = require('./api-compiled.js');

function home(ctx) {
  ctx.render('app');
}

function book(ctx) {
  ctx.render('book', {
    csrfToken: ctx.csrf
  });
}

function epub(ctx) {
  ctx.render('epub', {
    target: 'EPUB'
  });
}

function epub2(ctx) {
  ctx.render('epub', {
    target: 'EPUB-balloon'
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
