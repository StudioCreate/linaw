// load node modules
var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var socket = require('socket.io');


// set defaults
var port = process.env.PORT || 8080;

// create app
var app = express();

// use bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// set static folders
app.use(express.static('./public'));

// set view engine
app.set('view engine', 'jade');

// create server
var server = http.createServer(app).listen(port, function() {
  console.log("Express server listening on port " + port);
});

// create io for sockets
var io = socket.listen(server);

// export config
module.exports = {
  app: app,
  server: server,
  port: port,
  io: io
}
