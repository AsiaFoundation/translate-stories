'use strict';

let home = (() => {
  var ref = _asyncToGenerator(function* (ctx) {
    ctx.render('app');
  });

  return function home(_x) {
    return ref.apply(this, arguments);
  };
})();

let book = (() => {
  var ref = _asyncToGenerator(function* (ctx) {
    ctx.render('book');
  });

  return function book(_x2) {
    return ref.apply(this, arguments);
  };
})();

let translate = (() => {
  var ref = _asyncToGenerator(function* (ctx) {
    console.log(ctx.body);
    ctx.redirect('/book');
  });

  return function translate(_x3) {
    return ref.apply(this, arguments);
  };
})();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

module.exports = {
  home: home,
  book: book,
  translate: translate
};

