/*
 * Image routers
 */

var request = require('request');
var im = require('../core/image');
var config = require('../../config/config.json');

exports.upload = function(req, res, next) {
  var imgUrl = req.params.url;
  var filename = req.params.filename;

  if (typeof imgUrl === 'undefined') {
    if (typeof filename === 'undefined') {
      res.send(400, {err: 'parameter error'});
      next();
    } else {
      var tmp = filename.split('.');
      if (tmp.length === 0 || config.support.indexOf(tmp[1]) === -1) {
        res.send(400, {err: 'unsupport file format'});
        next();
      } else {
        var image = req.params.image;
        var imgCnt = new Buffer(image, 'base64').toString('binary');

        im.upload(tmp[1], imgCnt, function(err, meta) {
          if (err) {
            res.send(500, {err: err.message});
          } else {
            res.send(meta);
          }
          next();
        });
      }
    }
  } else {
    /* When pass image url to image service */
    request.get({url: imgUrl, encoding: null}, function(err, response, body) {
      if (err) {
        res.send(500, {err: err.message});
        next();
      } else {
        var ctype = response.headers['content-type'];
        if (ctype.indexOf('image') === -1) {
          res.send(400, {err: 'not a valid image url'});
          next();
        } else {
          /* Get image type */
          var identify = body.toString('hex', 0, 4);
          var format = null;

          if (identify.indexOf('8950') != -1) {
            format = 'png';
          } else if (identify.indexOf('ffd8') != -1) {
            format = 'jpg';
          }

          if (format === null) {
            res.send(400, {err: 'unknown image format'});
            next();
          } else {
            /* Save to server */
            im.upload(format, body, function(err, meta) {
              if (err) {
                res.send(500, {err: err.message});
              } else {
                res.send(meta);
              }
              next();
            });
          }
        }
      }
    });
  }
};

exports.download = function(req, res, next) {

};