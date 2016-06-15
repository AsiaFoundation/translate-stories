const Filepicker = require('filepicker-node');
const Source = require('../models/source.js');

function upload(req, res) {
  if (!req.user) {
    return res.redirect('/login');
  }
  req.pipe(req.busboy);
  req.busboy.on('file', function (fieldname, file, filename) {
    
  });
}

module.exports = {
  upload: upload
};
