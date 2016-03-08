// load modules
var serverConfig = require('./server.js');

// set defaults
var app = serverConfig.app;
var port = serverConfig.port;
var server = serverConfig.server;
var io = serverConfig.io;

// use routing
require('./routes.js');

// use apps
require('./HueBridge.js');
require('./sonos.js');
