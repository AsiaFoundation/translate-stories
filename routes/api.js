const JSZip = require('jszip');

const Checkout = require('../models/checkout.js');
const Comment = require('../models/comment.js');
const Source = require('../models/source.js');
const Translation = require('../models/translation.js');

// draft for how an EPUB ZIP file might be created
// currently I can't open the ZIPs that this creates?
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

// receive a POSTed comment and connect it to this Source and page of the book
function comment(req, res) {
  // require logged in user
  if (!req.user) {
    return res.redirect('/login');
  }

  // generate and save the Comment object
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

// create a Checkout record or resume editing a book
function checkout(req, res) {
  // require user to be logged in
  if (!req.user) {
    return res.redirect('/login');
  }

  // see if this book was already checked out by the user
  Checkout.findOne({ book_id: req.body.book_id, user_id: req.user._id }).exec(function (err, checkout) {
    if (err) {
      return res.json(err);
    }
    if (checkout) {
      // resume editing
      checkout.updated = new Date();
      checkout.save(function (err) {
        if (err) {
          return res.json(err);
        }
        res.redirect(req.body.book_id + '?from=' + checkout.inlang + '&to=' + checkout.outlang);
      });
    } else {
      // load information about the source
      Source.findOne({ book_id: req.body.book_id }).exec(function (err, book) {
        if (err) {
          return res.json(err);
        }
        if (!book) {
          return res.json({ error: 'no book with this book_id' });
        }

        // create and store a new Checkout object
        var c = new Checkout({
          book_id: book.book_id,
          user_id: req.user._id,
          user_name: req.user.name,
          title: book.title,
          cover: book.cover,
          started: new Date(),
          updated: new Date(),
          inlang: req.body.inlang,
          outlang: req.body.outlang
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
  output: output,
  comment: comment,
  checkout: checkout
};
