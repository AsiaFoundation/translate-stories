
const path = require('path');

const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const compression = require('compression');
const mongoose = require('mongoose');
const csrf = require('csurf');
const passport = require('passport');

const busboy = require('connect-busboy');

const routes = require('./routes/index.js');

console.log('Connecting to MongoDB (required)');
mongoose.connect(process.env.MONGOLAB_URI || process.env.MONGODB_URI || 'localhost');
mongoose.connection.on("error", function(err) {
  console.log(err);
});

var app = express();
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express['static'](__dirname + '/static'));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(compression());
app.use(cookieParser());
app.use(session({
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  }),
  secret: process.env.SESSION || 'fj23f90jfoijfl2mfp293i019eoijdoiqwj129',
  resave: false,
  saveUninitialized: false
}));

var csrfProtection = csrf({ cookie: true });

app.use(passport.initialize());
app.use(passport.session());
if (process.env.GOOGLE_CONSUMER_KEY && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(routes.login.googlesetup);
} else {
  passport.use(routes.login.setup);
}

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// upload helper
app.use(busboy());

// general routes
app.get('/', routes.home)
   .get('/epub', csrfProtection, routes.epub)
   .get('/epub2', csrfProtection, routes.epub2)
   .get('/book', csrfProtection, routes.book)
   .post('/translate', csrfProtection, routes.login.middleware, routes.translate);

// library and profile routes
app.get('/library', csrfProtection, routes.login.middleware, routes.library.index)
   .get('/library/listing/:id', csrfProtection, routes.login.middleware, routes.library.listing)
   .get('/library/add', csrfProtection, routes.login.middleware, routes.library.add)
   .get('/profile', csrfProtection, routes.login.middleware, routes.library.profile)
   .get('/profile/:user_name', csrfProtection, routes.login.middleware, routes.library.profile);

// verify routes
app.get('/verify', csrfProtection, routes.login.middleware, routes.verify.index)
   .get('/verify/all', csrfProtection, routes.login.middleware, routes.verify.all)
   .get('/verify/:book_id', csrfProtection, routes.login.middleware, routes.verify.epub);

// API routes
app.get('/api/books', routes.api.books)
   .get('/api/books/:id', routes.api.book)
   .get('/api/books/:id/export', routes.api.output)
   .post('/api/comment', routes.api.comment)
   .post('/api/checkout', routes.api.checkout);

// login routes
app.get('/logout', routes.login.middleware, csrfProtection, routes.login.logout)
   .get('/bye', routes.login.middleware, csrfProtection, routes.login.bye)
   .get('/login', csrfProtection, routes.login.startlogin)
   .post('/login', passport.authenticate('local', { failureRedirect: '/login' }), csrfProtection, routes.login.locallogin)
   .get('/register', routes.login.middleware, csrfProtection, routes.login.startregister)
   .post('/register', routes.login.middleware, csrfProtection, routes.login.localregister)
   .get('/auth/google', passport.authenticate('google', { scope: ['email'], failureRedirect: '/login' }));

// upload routes
app.get('/uploader', csrfProtection, routes.login.middleware, routes.upload.uploader)
   .post('/upload', csrfProtection, routes.login.middleware, routes.upload.upload);

app.listen(process.env.PORT || 8080, function() {
  console.log('server is running...');
});

module.exports = app;
