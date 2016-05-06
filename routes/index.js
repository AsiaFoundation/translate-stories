function home (ctx) {
  ctx.render('app');
}

function book (ctx) {
  ctx.render('book');
}

function epub (ctx) {
  ctx.render('epub');
}

function translate (ctx) {
  console.log(ctx.body);
  ctx.redirect('/book');
}

module.exports = {
  home: home,
  book: book,
  epub: epub,
  translate: translate
};
