const Source = require('../models/source.js');

function index (req, res) {
  Source.find({}).exec(function(err, sources) {
    if (err) {
      return res.json(err);
    }
    res.render('library/index', {
      sources: sources,
      csrfToken: req.csrfToken()
    });
  });
}

function add (req, res) {
  res.render('library/addsource', {
    csrfToken: req.csrfToken()
  });
}

function listing (req, res) {
  Source.findOne({ book_id: { $in: [req.params.id, '/' + req.params.id] } }, function(err, source) {
    res.render('library/listing', {
      csrfToken: req.csrfToken(),
      source: source,
      user: req.user
    });
  });
}

module.exports = {
  index: index,
  add: add,
  listing: listing
};
