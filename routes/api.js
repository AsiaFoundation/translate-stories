const JSZip = require('jszip');

const Book = require('../models/book.js');
const Checkout = require('../models/checkout.js');
const Comment = require('../models/comment.js');
const Source = require('../models/source.js');

function books(req, res) {
  Book.find({}).exec(function (err, myBookData) {
    if (err) {
      return res.json(err);
    }
    res.json(myBookData);
  });
}

function book(req, res) {
  Book.find({ book_id: req.params.id }).exec(function(err, myBookData) {
    if (err) {
      return res.json(err);
    }
    res.json(myBookData);
  });
}

function output(req, res) {
  var zip = new JSZip();
  //var epub = zip.folder('EPUB');

  var meta = zip.folder('META-INF');
    meta.file('container.xml', "<?xml version='1.0' encoding='UTF-8' ?>\n" +
    "<container version='1.0' xmlns='urn:oasis:names:tc:opendocument:xmlns:container'>\n" +
       "<rootfiles>\n" +
          "<rootfile full-path='OPS/package.opf' media-type='application/oebps-package+xml'/>\n" +
       "</rootfiles>\n" +
    "</container>");
  var ops = zip.folder('OPS');
  var mime = zip.file('mimetype', 'application/epub+zip')
  zip
    .generateNodeStream({type:'nodebuffer',streamFiles:true})
    .pipe(res)
    .on('finish', function () {
        console.log("test.epub downloaded");
    });
}

function comment(req, res) {
  if (!req.user) {
    return res.redirect('/login');
  }
  var c = new Comment({
    user_id: req.user._id,
    book_id: req.body.book_id,
    user_name: req.user.name,
    page: req.body.page * 1,
    text: req.body.text,
    date: new Date()
  });
  c.save(function (err) {
    if (err) {
      return res.json(err);
    }
    res.json({ status: 'success', _id: c._id });
  });
}

function checkout(req, res) {
  if (!req.user) {
    return res.redirect('/login');
  }
  // see if this book is already checked out by the user
  Checkout.find({ book_id: req.body.book_id, user_id: req.user._id }).exec(function (err, checkouts) {
    if (err) {
      return res.json(err);
    }
    if (checkouts.length) {
      checkouts[0].updated = new Date();
      checkouts[0].save(function (err) {
        if (err) {
          return res.json(err);
        }
        res.redirect(req.body.book_id + '?from=' + checkouts[0].inlang + '&to=' + checkouts[0].outlang);
      });
    } else {
      Source.findOne({ book_id: req.body.book_id }).exec(function (err, book) {
        if (err) {
          return res.json(err);
        }
        if (!book) {
          return res.json({ error: 'no book with this book_id' });
        }
        var c = new Checkout({
          book_id: book.book_id,
          user_id: req.user._id,
          user_name: req.user.name,
          title: book.title,
          cover: book.cover,
          started: new Date(),
          updated: new Date(),
          inlang: req.body.inlang,
          outlang: req.body.outlang,
          comments: []
        });
        c.save(function(err) {
          if (err) {
            return res.json(err);
          }
          res.redirect(book.book_id + '?from=' + req.body.inlang + '&to=' + req.body.outlang);
        });
      });
    }
  });
}

module.exports = {
  books: books,
  book: book,
  output: output,
  comment: comment,
  checkout: checkout
};
