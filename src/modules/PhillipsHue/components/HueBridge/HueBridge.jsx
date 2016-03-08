import React from 'react';
import classNames from 'classnames';
import Radium from 'radium';
import color from 'color';

// components
import HueLight from '../HueLight/HueLight.jsx'

@Radium
/**
 * the HueBridge component
 * @class HueBridge
 * @property {Socket} socket a socket shared connection
 */
class HueBridge extends React.Component {

  constructor(props) {
    super(props);

    // bind methods
    this.handleLightChange = this.handleLightChange.bind(this);

    // allow and set initial state
    this.state = {
      lights: {}
    }
  }

  /**
   * before the component is mounted start a socket listener
   * after success the lights will be loaded into the state to make this
   * component a standalone module
   */
  componentWillMount() {
    this.props.socket.on('HueBridge', (data) => {
      if (!data) {
        return
      }
      let lights = this.state.lights;
      data.forEach((light, index) => {
        let state = light.state;
        lights[light.id] = lights[light.id] || {};
        Object.assign(lights[light.id], {
          name: light.name,
          id: light.id,
          on: state.on,
          hue: state.hue,
          saturation: state.sat,
          brightness: state.bri,
        });
      });
      this.setState({
        lights: lights
      });
    });
  }

  /**
   * change the state of the lights
   * @param  {Number,String} light  id of the light on the bridge
   * @param  {String}        toggle if set the action will be 'on' on 'off'
   */
  handleLightChange(light, toggle) {
    if (toggle) {
      // toggle is either 'on' or 'off'
      this.props.socket.emit('HueBridge', light.id, toggle);
    } else {
      // for now let's use the 'all' method as implemented in '/src/server/hue.js'
      this.props.socket.emit('HueBridge', light.id, {
        type: 'all',
        val: light
      });
    }
  }

  /**
   * create components for each light that has been found on the bridge
   * @param  {Object} state holds all lights in pretty format
   * @return {Array}        returns all lights as an Array of HueLight components
   */
  getLights(state) {
    let lights = [];
    for (let light in state) {
      lights.push(
        <HueLight key={ this.state.lights[light].name }
                  light={ this.state.lights[light] }
                  onChange={ this.handleLightChange }
                  toggle={ this.handleLightChange } />
      );
    }
    return lights;
  }

  render() {
    return (
      <div>
        <h2>Lights (Phillips hue)</h2>
        <div style={ {  display: 'flex'} }>
          { this.getLights(this.state.lights) }
        </div>
      </div>
      );
  }
}


export default HueBridge
