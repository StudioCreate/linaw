/**
 * connect to Sonos service
 * this module is a simple prototype to connect to a sonos system
 * the system and players are automatically discovered.
 * each player volume can be changed through a socket event
 * the options are currently unknown since the source module is not documented
 * the module is currently being rewritten and a dev version is loaded here
 */

// load modules
var SonosDiscovery = require('sonos-system');
var serverConfig = require('./server.js');

// set defaults
var app = serverConfig.app;
var port = serverConfig.port;
var server = serverConfig.server;
var io = serverConfig.io;
var settings = {
  port: port,
  cacheDir: './cache'
}

// create discovery
// discovery is the communication service between sonos and node

var discovery = new SonosDiscovery(settings);

// once the topology-change event has been fired the players should be visible
discovery.on('topology-change', function() {
  console.log(discovery)
});

// connect via sockets
io.on('connection', function(socket) {
  socket.on('volume', function(player, value) {
    discovery.players[player].setVolume(value)
  });
});
