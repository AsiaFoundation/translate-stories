const Checkout = require('../models/checkout.js');
const Source = require('../models/source.js');
const User = require('../models/user.js');

const languageKeys = {
  en: {
    en: 'English',
    th: 'Thai',
    karen: 'Karen',
    kh: 'Khmer'
  },
  th: {
    en: 'อังกฤษ',
    th: 'ภาษาไทย',
    karen: 'ภาษากะเหรี่ยง',
    kh: 'ภาษาเขมร'
  }
};

function getLanguageKeys(user) {
  if (user) {
    return languageKeys[user.preferredLanguage];
  } else {
    return languageKeys['en'];
  }
}

function index (req, res) {
  Source.find({}).exec(function(err, sources) {
    if (err) {
      return res.json(err);
    }
    res.render('library/index', {
      sources: sources,
      csrfToken: req.csrfToken(),
      languageKeys: getLanguageKeys(req.user),
      user: req.user
    });
  });
}

function add (req, res) {
  res.render('library/addsource', {
    csrfToken: req.csrfToken()
  });
}

function profile (req, res) {
  if (!req.user) {
    return res.redirect('/login');
  }
  var user_name = req.user.name;
  if (req.params.user_name) {
    user_name = req.params.user_name;
  }
  Checkout.find({ user_name: user_name }).sort('-updated').exec(function (err, checkouts){
    if (err) {
      return res.json(err);
    }

    function printProfile(user, isMe) {
      res.render('library/profile', {
        csrfToken: req.csrfToken(),
        user: user,
        checkouts: checkouts,
        languageKeys: getLanguageKeys(user),
        isMe: isMe
      });
    }

    if (user_name === req.user.name) {
      // it's me
      printProfile(req.user, true);
    } else {
      // it's someone else's
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

function listing (req, res) {
  Source.findOne({ book_id: { $in: [req.params.id, '/' + req.params.id] } }, function(err, source) {
    if (err) {
      return res.json(err);
    }
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
        languageKeys: getLanguageKeys(req.user)
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
