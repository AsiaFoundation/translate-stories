const Source = require('../models/source.js');

function index (req, res) {
  Source.find({}).exec(function(err, sources) {
    if (err) {
      return res.json(err);
    }
    res.render('library', {
      sources: sources,
      csrfToken: req.csrfToken()
    });
  });
}

function add (req, res) {
  res.render('addsource', {
    csrfToken: req.csrfToken()
  });
}

module.exports = {
  index: index,
  add: add
};
