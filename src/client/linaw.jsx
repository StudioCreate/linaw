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
    this.setHue = this.setHue.bind(this);
    this.setBrightness = this.setBrightness.bind(this);
    this.setSaturation = this.setSaturation.bind(this);
    this.setAudioVolume = this.setAudioVolume.bind(this);

    // allow and set initial state
    this.state = {
      modules: dummyProps.modules
    }
  }

  /**
   * turn lights on
   */
  lightsOn() {
    socket.emit('lights', 'on');
  }

  /**
   * turn lights off
   */
  lightsOff() {
    socket.emit('lights', 'off');
  }

  /**
   * set light hue
   */
  setHue(e) {
    socket.emit('lights', {
      type: 'hue',
      val: e.target.value
    });
  }

  /**
   * set light brightness
   */
  setBrightness(e) {
    socket.emit('lights', {
      type: 'brightness',
      val: e.target.value
    });
  }

  /**
   * set light saturation
   */
  setSaturation(e) {
    socket.emit('lights', {
      type: 'saturation',
      val: e.target.value
    });
  }

  /**
   * set audio volume
   */
  setAudioVolume(player, e) {
    socket.emit('volume', player, e.target.value);
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
            <h1>TV (LG webOS 2.0)</h1>
          </div>
          );
        break;

      // AUDIO
      case 'sonos':
        return (
          <div key={ data.module.id }>
            <h1>Audio (Sonos)</h1>
            <h2>volume</h2>
            <input type='range'
                   min={ 0 }
                   max={ 100 }
                   defaultValue={ 10 }
                   onChange={ this.setAudioVolume.bind(this, 0) } />
            <input type='range'
                   min={ 0 }
                   max={ 100 }
                   defaultValue={ 10 }
                   onChange={ this.setAudioVolume.bind(this, 1) } />
          </div>
          );
        break;

      // LIGHT
      case 'hue':
        return (
          <div key={ data.module.id }>
            <h1>Lights (Phillips hue)</h1>
            <button onClick={ this.lightsOn }>
              on
            </button>
            <button onClick={ this.lightsOff }>
              off
            </button>
            <h2>h</h2>
            <input type='range'
                   min={ 0 }
                   max={ 65535 }
                   defaultValue={ 65535 / 2 }
                   onMouseUp={ this.setHue } />
            <h2>s</h2>
            <input type='range'
                   min={ 0 }
                   max={ 100 }
                   defaultValue={ 50 }
                   onMouseUp={ this.setSaturation } />
            <h2>b</h2>
            <input type='range'
                   min={ 0 }
                   max={ 100 }
                   defaultValue={ 50 }
                   onMouseUp={ this.setBrightness } />
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
      <div className={ 'LInaW-client' }>
        { modules }
      </div>
      );
  }
}

// render the app
reactDOM.render(<LInAW/>, document.getElementById('LInAW'));
