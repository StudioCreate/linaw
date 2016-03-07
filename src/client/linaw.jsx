/**
 * LInAW
 * React.js powered client for the LInAW app
 */

import React from 'react';
import reactDOM from 'react-dom';
import classNames from 'classnames';
import color from 'color';
const socket = require('socket.io-client')('http://localhost:8080');

// create some dummy props 
// until we implement a real modular config
const dummyProps = {
  modules: {
    'tv': {
      module: {
        id: 'webos:2.0'
      }
    },
    'audio': {
      module: {
        id: 'sonos'
      }
    },
    'light': {
      module: {
        id: 'hue'
      }
    }
  },
  lights: {
  }
};

/**
 * the LInAW component
 * @class LInAW
 */
class LInAW extends React.Component {

  constructor(props) {
    super(props);

    // bind methods
    this.lightsOn = this.lightsOn.bind(this);
    this.lightsOff = this.lightsOff.bind(this);
    this.setColorState = this.setColorState.bind(this);
    this.setHue = this.setHue.bind(this);
    this.setBrightness = this.setBrightness.bind(this);
    this.setSaturation = this.setSaturation.bind(this);
    this.setAudioVolume = this.setAudioVolume.bind(this);
    this.handleAudio = this.handleAudio.bind(this);

    // allow and set initial state
    this.state = {
      modules: dummyProps.modules,
      lights: dummyProps.lights
    }

    // set helpers
    this.hueRange = 65535;
    this.backgroundColor = '#010102';
    this.color = '#fefefe';
  }

  componentWillMount() {
    socket.on('lights', (data) => {
      console.log(data)
      let lights = this.state.lights;
      data.forEach((light, index) => {
        let state = light.state;
        lights[light.id] = lights[light.id] || {};
        lights[light.id].name = light.name;
        lights[light.id].on = state.on;
        lights[light.id].hue = state.hue;
        lights[light.id].saturation = state.sat;
        lights[light.id].brightness = state.bri;

      });
      this.setState({
        lights: lights
      });
    });
  }

  /**
   * set the internal state of the slider values
   * @param {String,Number} id   the light id
   * @param {String}        prop the lightProperty to change[description]
   * @param {Event}         e    the event that triggered the method
   */
  setColorState(id, prop, e) {
    let lights = this.state.lights;
    let value = e.target.value;
    lights[id][prop] = value;
    this.setState({
      lights: lights
    })
  }

  /**
   * turn lights on
   */
  lightsOn(id) {
    let lights = this.state.lights;
    lights[id].on = true;
    this.setState({
      lights: lights
    })
    socket.emit('lights', id, 'on');
  }

  /**
   * turn lights off
   */
  lightsOff(id) {
    let lights = this.state.lights;
    lights[id].on = false;
    this.setState({
      lights: lights
    });
    socket.emit('lights', id, 'off');
  }

  /**
   * send hue val to hardware
   * @param {String,Number} id the light id
   * @param {Event}         e  the event that triggered the method
   */
  setHue(id, e) {
    let value = e.target.value;
    socket.emit('lights', id, {
      type: 'hue',
      val: value
    });
  }

  /**
   * send bri val to hardware
   * @param {String,Number} id the light id
   * @param {Event}         e  the event that triggered the method
   */
  setBrightness(id, e) {
    let value = e.target.value;
    socket.emit('lights', id, {
      type: 'brightness',
      val: value
    });
  }

  /**
   * send sat val to hardware
   * @param {String,Number} id the light id
   * @param {Event}         e  the event that triggered the method
   */
  setSaturation(id, e) {
    let value = e.target.value;
    socket.emit('lights', id, {
      type: 'saturation',
      val: value
    });
  }

  /**
   * set audio volume
   */
  setAudioVolume(player, e) {
    socket.emit('volume', player, e.target.value);
  }
  /**
   * set audio volume
   */
  handleAudio(player, type, e) {
    console.log(player,type)
    socket.emit(type, player);
  }

  /**
   * get the module
   * currently hardcoded prototypes to test the interaction
   * ths method should return components that offer communication
   * @param  {Object} data module config
   * @return {Component}   returns a corresponding component to an app
   */
  getModule(data) {

    // for now let's use a switch 
    // to get the module
    switch (data.module.id) {

      // TV
      case 'webos:2.0':
        return (
          <div key={ data.module.id }>
            <h2>TV (LG webOS 2.0)</h2>
            <p>
              app not configured
            </p>
          </div>
          );
        break;

      // AUDIO
      case 'sonos':
        return (
          <div key={ data.module.id }>
            <h2>Audio (Sonos)</h2>
            <button onClick={this.handleAudio.bind(this,0,'play')}>play</button>
            <button onClick={this.handleAudio.bind(this,0,'pause')}>pause</button>
            <h3>Play:3</h3>
            <input type='range'
                   min={ 0 }
                   max={ 100 }
                   defaultValue={ 10 }
                   onChange={ this.setAudioVolume.bind(this, 1) } />
            <h3>Play:5</h3>
            <input type='range'
                   min={ 0 }
                   max={ 100 }
                   defaultValue={ 10 }
                   onChange={ this.setAudioVolume.bind(this, 0) } />
          </div>
          );
        break;

      // LIGHT
      case 'hue':
        let lights = [];
        for (let light in this.state.lights) {
          let oneLight = this.state.lights[light];
          let color = `
          ${oneLight.hue / this.hueRange * 360},
          ${oneLight.saturation / 255 * 100}%,
          ${oneLight.brightness / 255 * 50 + 25}%`;

          lights.push(
            <div key={ light }
                 style={ {  padding: '10px'} }>
              <h3>{ oneLight.name } <span style={ {  display: 'inline-block',  margin: '.5em',  height: '2em',  width: '2em',  borderRadius: '100%',  border: '1px solid currentColor',  backgroundColor: `hsl(${color})`,  color: this.color} }/></h3>
              <button onClick={ this.lightsOn.bind(this, light) }
                      style={ {  backgroundColor: oneLight.on ? this.color : this.backgroundColor,  color: oneLight.on ? this.backgroundColor : this.color} }>
                on
              </button>
              <button onClick={ this.lightsOff.bind(this, light) }
                      style={ {  backgroundColor: oneLight.on ? this.backgroundColor : this.color,  color: oneLight.on ? this.color : this.backgroundColor,} }>
                off
              </button>
              <h3>h</h3>
              <input type='range'
                     min={ 0 }
                     max={ this.hueRange }
                     value={ oneLight.hue }
                     onChange={ this.setColorState.bind(this, light, 'hue') }
                     onMouseUp={ this.setHue.bind(this, light) } />
              <h3>s</h3>
              <input type='range'
                     min={ 0 }
                     max={ 255 }
                     value={ oneLight.saturation }
                     onChange={ this.setColorState.bind(this, light, 'saturation') }
                     onMouseUp={ this.setSaturation.bind(this, light) } />
              <h3>b</h3>
              <input type='range'
                     min={ 0 }
                     max={ 255 }
                     value={ oneLight.brightness }
                     onChange={ this.setColorState.bind(this, light, 'brightness') }
                     onMouseUp={ this.setBrightness.bind(this, light) } />
            </div>
          );
        }
        return (
          <div key={ data.module.id }>
            <h2>Lights (Phillips hue)</h2>
            <div style={ {  display: 'flex'} }>
              { lights }
            </div>
          </div>
          );
        break;

      // fallback
      default:
        return (
          <div key={ key }>
            app not available
          </div>
          );
        break;
    }
  }

  /**
   * returns all modules that are loaded in the current state of the app
   * @return {Array} a list of modules to display
   */
  getModules() {
    let configuredModules = [];
    let modules = this.state.modules;
    for (let module in modules) {
      configuredModules.push(this.getModule(modules[module]));
    }
    return configuredModules
  }

  /**
   * render app
   * @return {Component} returns the component
   */
  render() {
    let modules = this.getModules();
    return (
      <div className={ 'LInaW-client' }
           style={ {  position: 'absolute',  top: 0,  right: 0,  bottom: 0,  left: 0,  backgroundColor: this.backgroundColor,  color: this.color,} }>
        <h1>LInAW</h1>
        { modules }
      </div>
      );
  }
}

// render the app
reactDOM.render(<LInAW/>, document.getElementById('LInAW'));
