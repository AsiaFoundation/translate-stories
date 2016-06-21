const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const crypto = require('crypto');

const User = require('../models/user.js');

var middleware = function(req, res, next) {
  if (process.env.GOOGLE_CONSUMER_KEY && process.env.GOOGLE_CLIENT_SECRET) {
    //passport.authenticate('google', { scope: ['email'], failureRedirect: '/login' })(req, res, next);
    next();
  } else {
    passport.authenticate('local', function(err, user, info) {
      req.authenticated = !! user;
      next();
    })(req, res, next);
  }
};

var confirmLogin = function (req, res, next) {
  // this runs once, after the callback from Google
  passport.authenticate('google', { scope: ['email'], failureRedirect: '/login' })(req, res, next);
};

var pwdhash = function (pwd, salt, fn) {
  var len = 128;
  var iterations = 12000;
  if (3 == arguments.length) {
    crypto.pbkdf2(pwd, salt, iterations, len, function(err, hash){
      fn(err, hash.toString('base64'));
    });
  } else {
    fn = salt;
    crypto.randomBytes(len, function(err, salt){
      if (err) return fn(err);
      salt = salt.toString('base64');
      crypto.pbkdf2(pwd, salt, iterations, len, function(err, hash){
        if (err) return fn(err);
        fn(null, salt, hash.toString('base64'));
      });
    });
  }
};

var logout = function (req, res) {
  req.logout();
  res.redirect('/bye');
};

var locallogin = function(req, res) {
  res.redirect('/library');
};

var startlogin = function (req, res) {
  res.render('login', {
    forUser: req.user,
    csrfToken: req.csrfToken(),
    newuser: req.query.user,
    googly: (process.env.GOOGLE_CONSUMER_KEY && process.env.GOOGLE_CLIENT_SECRET)
  });
};

var startregister = function (req, res) {
  if (req.user) {
    return res.redirect('/login');
  }
  res.render('register', {
    csrfToken: req.csrfToken()
  });
};

var bye = function (req, res) {
  if (req.user) {
    res.redirect('/logout');
  } else {
    res.render('bye');
  }
};

var localregister = function (req, res) {
  var languages = req.body.languages;
  if (typeof languages === 'string') {
    languages = [languages];
  }
  if (!languages || !languages.length) {
    return res.redirect('/register');
  }

  User.find({ name: req.body.username.toLowerCase() }, function (err, users) {
    if (err) {
      return printError(res, err);
    }
    if (users.length) {
      return printError(res, 'user with that name already exists');
    }
    pwdhash(req.body.password, function (err, salt, hash) {
      if (err) {
        return printError(res, err);
      }

      var u = new User({
        name: req.body.username.toLowerCase(),
        localpass: hash,
        salt: salt,
        test: false,
        verify: (req.body.canVerify === 'on'),
        readLanguages: languages,
        writeLanguages: languages,
        preferredLanguage: languages[0] || 'en'
      });
      u.save(function (err) {
        if (err) {
          return printError(err, res);
        }
        res.redirect('/login?user=' + u.name);
      });
    });
  });
};

var setup = new Strategy(function(username, password, cb) {
  User.findOne({ name: username.toLowerCase() }, function(err, user) {
    if (err) { return cb(err); }
    if (!user) { return cb(null, false); }
    pwdhash(password, user.salt, function (err, hash) {
      if (err) { return cb(err); }
      if (hash !== user.localpass) { return cb(null, false); }
      return cb(null, user);
    });
  });
});

var googlesetup = null; /*new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CONSUMER_KEY,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'https://1batch.co/profile?justLoggedIn=true',
    passReqToCallback: true
  },
  function(request, accessToken, refreshToken, profile, done) {
    User.findOne({ googid: profile.id }, function (err, user) {
      if (!user) {
        user = new User({
          googid: profile.id,
          name: profile.email,
          test: false
        });
        user.save(function() {
          return done(err, user);
        });
      } else {
        return done(err, user);
      }
    });
  });*/

module.exports = {
  middleware: middleware,
  confirmLogin: confirmLogin,
  logout: logout,
  locallogin: locallogin,
  localregister: localregister,
  startregister: startregister,
  startlogin: startlogin,
  bye: bye,
  setup: setup,
  googlesetup: googlesetup
};
