
const path = require('path');

const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const convert = require('koa-convert');
const session = require('koa-generic-session');
const MongoStore = require('koa-generic-session-mongo');
const jade = require('koa-jade-render');
const logger = require('koa-logger');
const router = require('koa-router')();
const compression = require('koa-compress');
const mongoose = require('mongoose');
const csrf = require('koa-csrf');
const kstatic = require('koa-static');

const routes = require('./routes/index.js');

console.log('Connecting to MongoDB (required)');
mongoose.connect(process.env.MONGOLAB_URI || process.env.MONGODB_URI || 'localhost');
mongoose.connection.on("error", function(err) {
  console.log(err);
});

var app = new Koa();
app.use(bodyParser());
app.use(compression());
app.use(jade(path.join(__dirname, 'views')));
app.use(convert(kstatic(__dirname + '/static')));

app.keys = ['wkpow3jocijoid3jioj3', 'cekopjpdjjo3jcjio3jc'];
app.use(convert(session({
  store: new MongoStore()
})));

app.use(logger());
csrf(app);
app.use(convert(csrf.middleware));

router
  .get('/', routes.home)
  .get('/epub', routes.epub)
  .get('/book', routes.book)
  .post('/translate', routes.translate);

app.use(router.routes())
  .use(router.allowedMethods());

app.listen(process.env.PORT || 8080);

module.exports = app;
