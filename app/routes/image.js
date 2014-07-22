/*
 * Image routers
 */

var im = require('./core/image');
var config = require('../../config/config.json');

exports.upload = function(req, res, next) {
  var filename = req.params.filename;
  var tmp = filename.split('.');

  if (tmp.length === 0 || config.support.indexOf(tmp[1]) === -1) {
    res.send(400, {msg: 'unsupport file format'});
    next();
  } else {
    var image = req.params.image;
    var imgCnt = new Buffer(image, 'base64').toString('binary');

    im.upload(tmp[1], imgCnt, function(err, meta) {
      if (err) {
        res.send(400, {msg: err.message});
      } else {
        res.send(meta);
      }
      next();
    });
  }
};

exports.download = function(req, res, next) {

};