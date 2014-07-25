// Test image service

var fs = require('fs')
var request = require('request');
var assert = require('assert');
var server = require('../app/app');
var apiHost = null;
var data = null;
var options = null;

describe("Test image service", function() {
  before(function() {
    server.listen(8000);
    apiHost = 'http://localhost:8000/upload';
  });

  describe('Upload image through image url: ', function() {
    it('should upload image through url ok', function(done) {
      data = {
        "url": "http://pic2.zhimg.com/99515b1dca070475a876f13659a63b4e_m.jpg"
      };

      options = {
        uri: apiHost,
        headers: {
          'Content-Type': 'application/json'
        },
        json: data
      };

      request.post(options, function(err, response, body) {
        if (err) {
          assert.ifError(err);
        } else {
          assert.equal(response.statusCode, 200);
        }
        done();
      });
    });
  });
  
  describe('Upload image through base64 encoded data: ', function() {
    it('should upload image through base64 encoded data', function(done) {
      var path = __dirname + '/14703354664_a2e62bb628_q.jpg';
      var cnt = fs.readFileSync(path);
      var filename = 'testtest.jpg';
      var image = cnt.toString('base64');

      data = {
        'filename': filename,
        'image': image
      };

      options = {
        uri: apiHost,
        headers: {
          'Content-Type': 'application/json'
        },
        json: data
      };

      request.post(options, function(err, response, body) {
        if (err) {
          assert.ifError(err);
        } else {
          assert.equal(response.statusCode, 200);
        }
        done();
      });
    });
  });
});
