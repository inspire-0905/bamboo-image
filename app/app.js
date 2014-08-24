/*
 * Main entry
 */

var restify = require('restify');
var bunyan = require('bunyan');
var image = require('./routes/image');

var log = bunyan.createLogger({
  name: 'bamboo-image',
  serializers: {
    req: bunyan.stdSerializers.req
  }
});


var server = restify.createServer({
  name: 'bamboo-image',
  log: log
});

// plugin
server.use(restify.bodyParser({
  mapParams: true,
  mapFiles: false
}));
server.use(restify.queryParser());
server.use(restify.gzipResponse());
server.use(restify.fullResponse());
server.use(restify.CORS({
  origins: ['*'],
  headers: ['Content-Type,Accept,X-Requested-With,Authorization']
}));


// Register handlers
server.pre(function(req, res, next) {
  req.log.info({req: req}, 'REQUEST');
  next();
});
server.post('/upload', image.upload);

module.exports = server;
