// load modules
var serverConfig = require('./server');

// set defaults
var app = serverConfig.app;
var port = serverConfig.port;
var server = serverConfig.server;
var io = serverConfig.io;

// use routing
require('./routes');

// use modules
require('./modules')
