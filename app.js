
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

app.get('/', routes.home);
app.get('/epub', csrfProtection, routes.epub);
app.get('/epub2', csrfProtection, routes.epub2);
app.get('/book', csrfProtection, routes.book);
app.post('/translate', csrfProtection, routes.translate);
app.get('/api/books', routes.api.books);

app.listen(process.env.PORT || 8080, function() {
  console.log('server is running...');
});

module.exports = app;
