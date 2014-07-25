/*
 * Image core
 */

var async = require('async');
var events = require('events');
var util = require('util');
var crypto = require('crypto');
var config = require('../../config/config.json');
var fs = require('fs');
var gm = require('gm');

function Im() {
  var root = __dirname.split('/');
  root = root.slice(0, -2);
  root.push('images');
  this.imgDir = root.join('/');

  events.EventEmitter.call(this);
}

util.inherits(Im, events.EventEmitter);

Im.prototype.upload = function(suffix, content, callback) {
  var that = this;

  var md5 = crypto.createHash('md5');

  var fileHash = md5.update(content).digest('hex');

  var imageName = fileHash + '.' + suffix;
  var filepath = that.imgDir + '/' + imageName; 

  fs.writeFile(filepath, content, function(err) {
    if (err) {
      return callback(err, null);
    } else {
      //that.emit('resize', imageName);
      console.log(filepath);
      gm(filepath)
      .size(function(err, size) {
        if (err) {
          console.log(err);
          return callback(err, null);
        } else {
          var meta = {};

          meta.url = config.domain + '/' + imageName;
          meta.width = size.width;
          meta.height = size.height;

          return callback(null, meta);
        }
      });
    }
  });
};


var im = new Im();

im.on('resize', function(imageName) {
  var that = this;

  var keys = Object.keys(config.size);
  var width = null;
  var height = null;
  var tmp = null;
  var outName = null;
  var tasks = [];
  var target = that.imgDir + '/' + imageName;
  var fileinfo = imageName.split('.');

  for (var i = 0; i < keys.length; i++) {
    width = config.size[keys[i]][0];
    height = config.size[keys[i]][1];
    outname = that.imgDir + '/' + fileinfo[0] + '_' + keys[i] + '.' + fileinfo[1];

    tmp = function(cb) {
      gm(target)
      .thumb(width, height, outname, function(err) {
        if (err) {
          cb(err, null);
        } else {
          cb(null, null);
        }
      });
    };

    tasks.push(tmp);
  }

  async.series(
    tasks,
    function(err, results) {
      if (err) {
        console.error(err);
      }
    }
  );
});

module.exports = im;

