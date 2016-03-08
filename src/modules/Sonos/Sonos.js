/**
 * connect to Sonos service
 * this module is a simple prototype to connect to a sonos system
 * the system and players are automatically discovered.
 * each player volume can be changed through a socket event
 * the options are currently unknown since the source module is not documented
 * the module is currently being rewritten and a dev version is loaded here
 */

/**
 * Simple Sonos module
 * This module is using an experimental version of sonos-discovery
 * current progress of the new version can be tracked here:
 *   https://github.com/jishi/node-sonos-discovery/tree/refactor-with-promises
 * for now I forked and made a release for stable versioning
 * see '/packages.json' to retreive the currently used version
 */

// load modules
var SonosDiscovery = require('sonos-system');
var serverConfig = require('../../server/server.js');

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
  //console.log(discovery)
});

// connect via sockets
io.on('connection', function(socket) {
  socket.on('volume', function(player, value) {
    discovery.players[player].setVolume(value)
  });
  socket.on('play', function(player) {
    console.log('>>>>>>>>>     play    <<<<<<<<<')
    var player = discovery.getPlayer('PLAY:5')/*for now play:5 is always the master discovery.players[player].roomName*/
    player.play();
  });
  socket.on('pause', function(player) {
    console.log('>>>>>>>>>     pause   <<<<<<<<<')
    var player = discovery.getPlayer('PLAY:5')/*for now play:5 is always the master discovery.players[player].roomName*/
    player.pause()
  });
});
