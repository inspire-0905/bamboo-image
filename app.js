/*
 * Main entry
 */

var restify = require('restify');
var bunyan = require('bunyan');
var log = bunyan.createLogger({name: 'bamboo-image'});
var image = require('./routes/image');

var server = restify.createServer({
	name: 'bamboo-image',
	log: log
});

// plugin
server.use(restify.bodyParser());
server.use(restify.queryParser());
server.use(restify.gzipResponse());
server.use(restify.CORS());


// Register handlers
server.post('/upload', image.upload);

module.exports = server;
