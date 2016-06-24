const Checkout = require('../models/checkout.js');
const Source = require('../models/source.js');
const User = require('../models/user.js');

const languages = require('../knownlanguages.js');

function index (req, res) {
  // show all books in the library
  Source.find({}).exec(function(err, sources) {
    if (err) {
      return res.json(err);
    }
    res.render('library/index', {
      sources: sources,
      csrfToken: req.csrfToken(),
      languageKeys: languages.names(req.user || req),
      user: req.user
    });
  });
}

// form to add a new EPUB Source (no POST destination created yet)
function add (req, res) {
  res.render('library/addsource', {
    csrfToken: req.csrfToken(),
    languageKeys: languages.names(req.user || req),
  });
}

// user profile (yours or someone else's)
function profile (req, res) {
  // you need to be logged in
  if (!req.user) {
    return res.redirect('/login');
  }

  var user_name = req.user.name;
  if (req.params.user_name) {
    user_name = req.params.user_name;
  }

  // load any books that this user is working on, starting with most recent
  Checkout.find({ user_name: user_name }).sort('-updated').exec(function (err, checkouts){
    if (err) {
      return res.json(err);
    }

    function printProfile(user, isMe) {
      res.render('library/profile', {
        csrfToken: req.csrfToken(),
        user: user,
        checkouts: checkouts,
        languageKeys: languages.names(user),
        isMe: isMe
      });
    }

    if (user_name === req.user.name) {
      // it's me
      printProfile(req.user, true);
    } else {
      // it's someone else
      User.findOne({ name: user_name }).exec(function(err, user) {
        if (err) {
          return res.json(err);
        }
        if (!user) {
          return res.json({ error: 'no user with that name' });
        }
        printProfile(user, false);
      });
    }
  });
}

// individual book listing in the library
function listing (req, res) {
  Source.findOne({ book_id: { $in: [req.params.id, '/' + req.params.id] } }, function(err, source) {
    if (err) {
      return res.json(err);
    }

    // have a list of everyone currently working on this book
    Checkout.find({ book_id: { $in: [req.params.id, '/' + req.params.id] } }, function(err, checkouts) {
      if (err) {
        return res.json(err);
      }
      var opencheckout = null;
      for (var c = 0; c < checkouts.length; c++) {
        if (checkouts[c].user_id === req.user._id) {
          opencheckout = checkouts[c];
          break;
        }
      }
      res.render('library/listing', {
        csrfToken: req.csrfToken(),
        source: source,
        checkouts: checkouts,
        opencheckout: opencheckout,
        user: req.user,
        languageKeys: languages.names(req.user)
      });
    });
  });
}

module.exports = {
  index: index,
  add: add,
  listing: listing,
  profile: profile
};
