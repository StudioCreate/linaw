/**
 * Simple phillips hue prototype
 * This is a simple module to control the 
 * lights connected to a hue bridge
 * To get a new user press the link button on the bridge and run this 
 * script within 30 seconds
 */

// load modules
var hue = require('node-hue-api');
var serverConfig = require('../../server/server.js');
var fs = require('fs');

// set defaults
var app = serverConfig.app;
var port = serverConfig.port;
var server = serverConfig.server;
var io = serverConfig.io;
var masterSocket;
//  set hue vars
var HueApi = hue.HueApi;
var lightState = hue.lightState;

var hueBridgeIP;
var hueBridgeID;
var hueLights;
var keyDir = './cache/PhillipsHue'
var clientKey = `${keyDir}/clientKey.txt`;
var hueUserID;
// the user will be created as a new LInAW client
var hueUser = 'LInAW';

// create an initital state
var state = {};

// create a global api
var hueUserApi;

/**
 * connect LInAW with the bridge
 */
function getHandshake() {
  return new Promise(function(resolve, reject) {
    if (fs.existsSync(clientKey)) {
      hueUserID = fs.readFileSync(clientKey);
      resolve(hueUserID);
    } else {
      reject();
    }
  });
}

/**
 * store the client key on the server
 * @param  {[type]} key username that LInAW used to register
 */
function storeClientKey(key) {
  console.log('Storing LInAW user: ' + key);
  if (!fs.existsSync(keyDir)) {
    fs.mkdirSync(keyDir);
  }
  fs.writeFileSync(clientKey, key);
}

/**
 * a helper to get the userID
 * @param {string} result the id
 */
function displayUserResult(result) {
  hueUserID = result;
  storeClientKey(hueUserID);
  // get the config (currently logging)
  getHueConfig(hueBidgeIP, hueUserID);

  // start connection to lightbulbs after user is created
  hueUserApi.lights()
    .then(displayLights)
    .done();
}

/**
 * sets the lights to our global cache
 * @param  {Object} result an object containing the lights
 */
function displayLights(result) {
  // the lights array is the value of the `lights` property
  hueLights = result.lights;
  console.log('found lights: ', hueLights.length)

  // create a state for each light
  hueLights.forEach(function(light, index) {
    state[light.id] = lightState.create()
  });
  
  // ensure socket connection before we proceed
  withMasterSocket()
    .then(function(socket) {
      socket.emit('ConnectHueBridge', hueLights);
      syncLights(result);
    });
}

/**
 * logs the config
 * @param  {Object} result the config
 */
function displayConfig(result) {
  //console.log(result);
}

/**
 * displays an error
 * @param  {String} err error message
 */
function displayError(err) {
  console.log(err);
}

/**
 * no operation
 */
function noop() {
}


/**
 * update lights to sync client with service
 */
function updateLights() {
  console.log(hueLights[0].state.bri)
  hueUserApi = new HueApi(hueBidgeIP, hueUserID);
  hueUserApi.lights()
    .then(syncLights)
    .done();
}


/**
 * sends the lights to the client and sets server side variable
 * @param  {Object} result an object containing the lights
 */
function syncLights(result) {
  hueLights = result.lights;
  // send Socket events with connection
  console.log(hueLights[0].state.bri)
  withMasterSocket()
    .then(function(socket) {
      socket.emit('HueBridge', hueLights);
    });
}


/**
 * set the hue value of a speciffic light
 * @param {Number, String} id id of the lamp
 * @param {Number, String} h  hue value (range [0 - 65535])
 */
function setHue(id, h) {
  hueUserApi.setLightState(id, state[id].hue(h))
    .then(updateLights)
    .done();
}

/**
 * set the saturation value of a speciffic light
 * @param {Number, String} id id of the lamp
 * @param {Number, String} s  saturation value (range [0 - 100])
 */
function setSaturation(id, s) {
  hueUserApi.setLightState(id, state[id].saturation(s))
    .then(updateLights)
    .done();
}

/**
 * set the brightness value of a speciffic light
 * @param {Number, String} id id of the lamp
 * @param {Number, String} b brightness value (range [0 - 100])
 */
function setBrightness(id, b) {
  hueUserApi.setLightState(id, state[id].brightness(b))
    .then(updateLights)
    .done();
}

/**
 * set the brightness value of a speciffic light
 * @param {Number, String} id    id of the lamp
 * @param {Object}         light collection of values
 */
function setHSL(id, light) {
  console.log(id,light)
  hueUserApi.setLightState(id, state[id].hue(light.h).sat(light.s).bri(light.l))
    .then(updateLights)
    .done();
}

/**
 * turn light on
 * @param {Number, String} id id of the lamp
 */
function turnOn(id) {
  hueUserApi.setLightState(id, state[id].on())
    .then(updateLights)
    .done();
}

/**
 * turn light off
 * @param {Number, String} id id of the lamp
 */
function turnOff(id) {
  hueUserApi.setLightState(id, state[id].off())
    .then(updateLights)
    .done();
}

/**
 * get the hue bridge and try to connect 
 * otherwise create a user and proceed
 * @param  {Object} bridge the bridge
 */
function getHueBridge(bridge) {
  // let's just take the first one for now
  hueBidgeIP = bridge[0].ipaddress;
  hueBidgeID = bridge[0].id;

  // if the user is undefined (required on initial installation)
  // we need to create a new user for this app
  if (!hueUserID) {
    var api = new HueApi();
    api.registerUser(hueBidgeIP, hueUser)
      .then(displayUserResult)
      .fail(displayError)
      .done();
  } else {
    // in case we already have a user 
    // we can connect the lights
    hueUserApi = new HueApi(hueBidgeIP, hueUserID);
    hueUserApi.lights()
      .then(displayLights)
      .done();
  }
}


/**
 * get the config from the bridge
 * @param  {String} ip   bridge IP
 * @param  {[type]} user bridge uder 
 *                        * manually created on first installation
 *                        * see comments about hueUserID
 */
function getHueConfig(ip, user) {
  hueUserApi = new HueApi(ip, user)
  hueUserApi.config().then(displayConfig).done();
}

/**
 * start promise based connection
 * @promise masterSocket
 */
function getMasterSocket() {
  return new Promise(function(resolve, reject) {
    io.on('connection', function(socket) {
      masterSocket = socket;

      socket.on('HueBridge', function(id, value) {
        if (!hueLights) { // better safe than sorry
          return
        }
        if (value === 'off') {
          turnOff(id);
        } else if (value === 'on') {
          turnOn(id);
        } else if (typeof value === 'object') {
          if (value.type === 'hue') {
            setHue(id, value.val);
          } else if (value.type === 'brightness') {
            setBrightness(id, value.val);
          } else if (value.type === 'saturation') {
            setSaturation(id, value.val);
          } else if (value.type === 'hsl') {
            setHSL(id, value.val);
          }
        }
      });
      // sync lights every time the component is mounted
      socket.on('MountHueBridge', function() {
        socket.emit('HueBridge', hueLights);
      });
      socket.on('ConnectHueBridge', function() {
        hue.nupnpSearch().then(getHueBridge).done();
      });
      // get handshake before attempting to connect
      getHandshake().then(function(hueUserID) {
        resolve(socket);
      }).catch(function() {
        reject(socket);
      });
    });
  });
}

getMasterSocket().then(function(socket) {
  console.log('found LInAW user on HueBridge: ' + hueUserID);
  // connect to bridge
  hue.nupnpSearch().then(getHueBridge).done();
}).catch(function(socket) {
  console.log('First usage, please click the link button on your HueBridge.');
  // prompt the user to click the link button
  socket.emit('ConnectHueBridge', hueLights);
});

function withMasterSocket(){
  return new Promise(function(resolve, reject){
    if (masterSocket) {
      resolve(masterSocket);
    } else {
      reject();
    }
  });
}


