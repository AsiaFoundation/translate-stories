const Source = require('../models/source.js');

// not yet implemented

function upload(req, res) {
  if (!req.user) {
    return res.redirect('/login');
  }
  req.pipe(req.busboy);
  req.busboy.on('file', function (fieldname, file, filename) {

  });
}

function uploader(req, res) {
  if (!req.user) {
    return res.redirect('/login');
  }

  res.render('uploader');
}

module.exports = {
  upload: upload,
  uploader: uploader
};
