async function home (ctx) {
  ctx.render('app');
}

async function book (ctx) {
  ctx.render('book');
}

async function translate (ctx) {
  console.log(ctx.body);
  ctx.redirect('/book');
}

module.exports = {
  home: home,
  book: book,
  translate: translate
};
