const Comment = require('../models/comment.js');
const Source = require('../models/source.js');
const Translation = require('../models/translation.js');

const languages = require('../knownlanguages.js');

function home (req, res) {
  if (!req.user) {
    return res.redirect('/login');
  }

  if (!req.user.canVerify) {
    return res.send('You must be an admin to verify translations.');
  }

  Translation.find({ language: { $in: req.user.readLanguages }, verified: { $ne: true } }).select('book_id').exec(function (err, translations) {
    if (err) {
      return res.json(err);
    }
    var sourceIDs = [];
    var translations_by_source = {};
    for (var t = 0; t < translations.length; t++) {
      var book_id = translations[t].book_id;
      if (translations_by_source[book_id.toLowerCase()]) {
        translations_by_source[book_id.toLowerCase()]++;
      } else {
        translations_by_source[book_id.toLowerCase()] = 1;
        sourceIDs.push(book_id.toLowerCase());
        sourceIDs.push('/' + book_id.toLowerCase());
        sourceIDs.push(book_id.toUpperCase());
        sourceIDs.push('/' + book_id.toUpperCase());
      }
    }
    Source.find({ book_id: { $in: sourceIDs } }).exec(function (err, sources) {
      if (err) {
        return res.json(err);
      }
      res.render('verify/index', {
        sources: sources,
        csrfToken: req.csrfToken(),
        languageKeys: languages.names(req.user || req),
        user: req.user,
        translations_by_source: translations_by_source
      });
    });
  });
}

function epub (req, res) {
  if (!req.user) {
    return res.redirect('/login');
  }

  if (!req.user.canVerify) {
    return res.send('You must be an admin to verify translations.');
  }

  Source.find({ book_id: { $in: [req.params.book_id, '/' + req.params.book_id] } }).exec(function(err, sources) {
    if (err) {
      return res.json(err);
    }
    if (!sources.length) {
      return res.json({ error: 'no source with this book_id' });
    }

    req.params.book_id = req.params.book_id.toUpperCase();
    Translation.find({
      book_id: { $in: [req.params.book_id, '/' + req.params.book_id] },
      verified: { $ne: true }
    }).exec(function (err, translations) {
      if (err) {
        return res.json(err);
      }
      Comment.find({ book_id: { $in: [req.params.book_id, '/' + req.params.book_id] } }).sort('page, -date').exec(function (err, comments) {
        if (err) {
          return res.json(err);
        }
        res.render('verify/epub', {
          translations: translations,
          source: sources[0],
          target: translations[0].book_id,
          csrf: req.csrfToken(),
          comments: comments
        });
      });
    });
  });
}

function all (req, res) {
  if (!req.user) {
    return res.redirect('/login');
  }

  if (!req.user.canVerify) {
    return res.send('You must be an admin to verify translations.');
  }

  Translation.find({}).exec(function (err, ts) {
    if (err) {
      return res.json(err);
    }
    return res.json(ts);
  });
}

module.exports = {
  index: home,
  epub: epub,
  all: all
};
