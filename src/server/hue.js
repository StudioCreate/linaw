/**
 * Simple phillips hue prototype
 * This is a simple module to control the 
 * lights connected to a hue bridge
 * it allows getting the bridge username by setting the ID to undefined
 * To get a new user press the link button on the bridge and run this 
 * script within 30 seconds
 */

// load modules
var hue = require('node-hue-api');
var serverConfig = require('./server.js');

// set defaults
var app = serverConfig.app;
var port = serverConfig.port;
var server = serverConfig.server;
var io = serverConfig.io;

//  set hue vars
var HueApi = hue.HueApi;
var lightState = hue.lightState;

var hueBridgeIP;
var hueBridgeID;
var hueLights;

// if the user is set do undefined a new user will be created and logged.
// until a caching mechanism is implemented the new user id needs to be copied here
var hueUserID = '3f65cc39239005b736da6e7d1bad0ebb';

// the user will be created as a new LInAW client
var hueUser = 'LInAW';

// create an initital state
var state = {};

// create a global api
var hueUserApi;

/**
 * a helper to get the userID
 * @param {string} result the id
 */
function displayUserResult(result) {
  hueUserID = result;

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

  // create a state for each light
  hueLights.forEach(function(light, index) {
    //console.log(light.state)
    state[light.id] = lightState.create()
  });
  masterSocket.then(function(socket) {
    socket.emit('lights', hueLights);
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
  hueUserApi.lights()
    .then(displayLights)
    .done();
}

/**
 * set the hue value of a speciffic light
 * @param {Number, String} id  id of the lamp
 * @param {Number, String} hue hue value (range [0 - 65535])
 */
function setHue(id, hue) {
  hueUserApi.setLightState(id, state[id].hue(hue))
    .then(noop)
    .done();
}

/**
 * set the saturation value of a speciffic light
 * @param {Number, String} id         id of the lamp
 * @param {Number, String} saturation saturation value (range [0 - 100])
 */
function setSaturation(id, saturation) {
  hueUserApi.setLightState(id, state[id].saturation(saturation))
    .then(noop)
    .done();
}

/**
 * set the brightness value of a speciffic light
 * @param {Number, String} id         id of the lamp
 * @param {Number, String} brightness brightness value (range [0 - 100])
 */
function setBrightness(id, brightness) {
  hueUserApi.setLightState(id, state[id].brightness(brightness))
    .then(noop)
    .done();
}

/**
 * turn light on
 * @param {Number, String} id id of the lamp
 */
function turnOn(id) {
  hueUserApi.setLightState(id, state[id].on())
    .then(noop)
    .done();
}

/**
 * turn light off
 * @param {Number, String} id id of the lamp
 */
function turnOff(id) {
  hueUserApi.setLightState(id, state[id].off())
    .then(noop)
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

// start connection
var masterSocket = new Promise(function(resolve, reject) {
  io.on('connection', function(socket) {

    hue.nupnpSearch().then(getHueBridge).done();
    socket.emit('lights', hueLights);
    resolve(socket);
  });
});

masterSocket.then(function(socket) {
  // handle io events
  socket.on('lights', function(id, value) {

    if (!hueLights) {
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
      }
    }
  });
});


