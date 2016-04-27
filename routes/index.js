async function home (ctx) {
  ctx.render('app');
}

async function book (ctx) {
  ctx.render('book');
}

module.exports = {
  home: home,
  book: book
};
