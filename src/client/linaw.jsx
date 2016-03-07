/**
 * LInAW
 * React.js powered client for the LInAW app
 */

import React from 'react';
import reactDOM from 'react-dom';
import classNames from 'classnames';
import color from 'color';

// components
import HueLight from './components/HueLight/HueLight.jsx'

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
  lights: {}
};





/**
 * the LInAW component
 * @class LInAW
 */
class LInAW extends React.Component {

  constructor(props) {
    super(props);

    // bind methods

    this.setAudioVolume = this.setAudioVolume.bind(this);
    this.handleAudio = this.handleAudio.bind(this);
    this.handleLightChange = this.handleLightChange.bind(this);

    // allow and set initial state
    this.state = {
      modules: dummyProps.modules,
      lights: dummyProps.lights
    }

    // set helpers
    this.backgroundColor = '#010102';
    this.color = '#fefefe';
  }

  componentWillMount() {
    socket.on('lights', (data) => {
      console.log(data)
      if (!data) {
        return
      }
      let lights = this.state.lights;
      data.forEach((light, index) => {
        let state = light.state;
        lights[light.id] = lights[light.id] || {};
        lights[light.id].name = light.name;
        lights[light.id].id = light.id;
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


  handleLightChange(light, toggle) {
    console.log(light)
    if (toggle) {
      socket.emit('lights', light.id, toggle);
    } else {
      socket.emit('lights', light.id, {
        type: 'all',
        val: light
      });
    }
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
    console.log(player, type)
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
            <button onClick={ this.handleAudio.bind(this, 0, 'play') }>
              play
            </button>
            <button onClick={ this.handleAudio.bind(this, 0, 'pause') }>
              pause
            </button>
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
          lights.push(
            <HueLight key={ this.state.lights[light].name }
                      light={ this.state.lights[light] }
                      onChange={ this.handleLightChange }
                      toggle={ this.handleLightChange } />
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
           style={ {  display: 'flex',  flexDirection: 'column',  position: 'absolute',  top: 0,  right: 0,  bottom: 0,  left: 0,  backgroundColor: this.backgroundColor,  color: this.color,} }>
        <div style={ {  flex: '0 0 auto',  padding: 10} }>
          LInAW
        </div>
        <div style={ {  flex: '1 1 1px',  overflow: 'auto'} }>
          { modules }
        </div>
      </div>
      );
  }
}

// render the app
reactDOM.render(<LInAW/>, document.getElementById('LInAW'));
