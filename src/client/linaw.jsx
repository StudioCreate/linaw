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
  lightsOn(id) {
    socket.emit('lights', id, 'on');
  }

  /**
   * turn lights off
   */
  lightsOff(id) {
    socket.emit('lights', id, 'off');
  }

  /**
   * set light hue
   */
  setHue(id, e) {
    socket.emit('lights', id, {
      type: 'hue',
      val: e.target.value
    });
  }

  /**
   * set light brightness
   */
  setBrightness(id, e) {
    socket.emit('lights', id, {
      type: 'brightness',
      val: e.target.value
    });
  }

  /**
   * set light saturation
   */
  setSaturation(id, e) {
    socket.emit('lights', id, {
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
            <h2>TV (LG webOS 2.0)</h2>
          </div>
          );
        break;

      // AUDIO
      case 'sonos':
        return (
          <div key={ data.module.id }>
            <h2>Audio (Sonos)</h2>
            <h3>Play:5</h3>
            <input type='range'
                   min={ 0 }
                   max={ 100 }
                   defaultValue={ 10 }
                   onChange={ this.setAudioVolume.bind(this, 1) } />
            <h3>Play:3</h3>
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
        let lightNames = {
          1: 'Left',
          2: 'Right'
        }
        for (let i = 1; i <= 2; i++) {
          lights.push(
            <div key={ i }
                 style={{padding: '10px'}}>
              <h3>{ lightNames[i] }</h3>
              <button onClick={ this.lightsOn.bind(this, i) }>
                on
              </button>
              <button onClick={ this.lightsOff.bind(this, i) }>
                off
              </button>
              <h3>h</h3>
              <input type='range'
                     min={ 0 }
                     max={ 65535 }
                     defaultValue={ 65535 / 2 }
                     onMouseUp={ this.setHue.bind(this, i) } />
              <h3>s</h3>
              <input type='range'
                     min={ 0 }
                     max={ 100 }
                     defaultValue={ 50 }
                     onMouseUp={ this.setSaturation.bind(this, i) } />
              <h3>b</h3>
              <input type='range'
                     min={ 0 }
                     max={ 100 }
                     defaultValue={ 50 }
                     onMouseUp={ this.setBrightness.bind(this, i) } />
            </div>
          );
        }
        return (
          <div key={ data.module.id }>
            <h2>Lights (Phillips hue)</h2>
            <div style={{display: 'flex'}}>
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
      <div className={ 'LInaW-client' }>
        { modules }
      </div>
      );
  }
}

// render the app
reactDOM.render(<LInAW/>, document.getElementById('LInAW'));
