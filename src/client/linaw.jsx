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
    1: {
      hue: 0,
      saturation: 0,
      brightness: 0,
      on: false,
    },
    2: {
      hue: 0,
      saturation: 0,
      brightness: 0,
      on: false,
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
    this.setColorState = this.setColorState.bind(this);
    this.setHue = this.setHue.bind(this);
    this.setBrightness = this.setBrightness.bind(this);
    this.setSaturation = this.setSaturation.bind(this);
    this.setAudioVolume = this.setAudioVolume.bind(this);

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
   * no operation
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
   * set light hue
   */
  setHue(id, e) {
    let lights = this.state.lights;
    let value = e.target.value;
    lights[id].hue = value;
    this.setState({
      lights: lights
    })
    socket.emit('lights', id, {
      type: 'hue',
      val: value
    });
  }

  /**
   * set light brightness
   */
  setBrightness(id, e) {
    let lights = this.state.lights;
    let value = e.target.value;
    lights[id].brightness = value;
    this.setState({
      lights: lights
    })
    socket.emit('lights', id, {
      type: 'brightness',
      val: value
    });
  }

  /**
   * set light saturation
   */
  setSaturation(id, e) {
    let lights = this.state.lights;
    let value = e.target.value;
    lights[id].saturation = value;
    this.setState({
      lights: lights
    })
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
          let color = `
          ${this.state.lights[i].hue / this.hueRange * 360},
          ${this.state.lights[i].saturation / 255 * 100}%,
          ${this.state.lights[i].brightness / 255 * 50 + 25}%`;
          lights.push(
            <div key={ i }
                 style={ {  padding: '10px'} }>
              <h3>{ lightNames[i] } <span style={ {  display: 'inline-block',  margin: '.5em',  height: '2em',  width: '2em',  borderRadius: '100%',  border: '1px solid currentColor',  backgroundColor: `hsl(${color})`,  color: this.color} }/></h3>
              <button onClick={ this.lightsOn.bind(this, i) }
                      style={ {  backgroundColor: this.state.lights[i].on ? this.color : this.backgroundColor,  color: this.state.lights[i].on ? this.backgroundColor : this.color} }>
                on
              </button>
              <button onClick={ this.lightsOff.bind(this, i) }
                      style={ {  backgroundColor: this.state.lights[i].on ? this.backgroundColor : this.color,  color: this.state.lights[i].on ? this.color : this.backgroundColor,} }>
                off
              </button>
              <h3>h</h3>
              <input type='range'
                     min={ 0 }
                     max={ this.hueRange }
                     value={ this.state.lights[i].hue }
                     onChange={ this.setColorState.bind(this, i, 'hue') }
                     onMouseUp={ this.setHue.bind(this, i) } />
              <h3>s</h3>
              <input type='range'
                     min={ 0 }
                     max={ 255 }
                     value={ this.state.lights[i].saturation }
                     onChange={ this.setColorState.bind(this, i, 'saturation') }
                     onMouseUp={ this.setSaturation.bind(this, i) } />
              <h3>b</h3>
              <input type='range'
                     min={ 0 }
                     max={ 255 }
                     value={ this.state.lights[i].brightness }
                     onChange={ this.setColorState.bind(this, i, 'brightness') }
                     onMouseUp={ this.setBrightness.bind(this, i) } />
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
