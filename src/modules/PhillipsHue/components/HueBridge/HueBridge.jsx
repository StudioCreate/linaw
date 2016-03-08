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
    this.confirmBridgeLink = this.confirmBridgeLink.bind(this);
    // allow and set initial state
    this.state = {
      lights: {}
    }
  }

  /**
   * before the component is mounted start a socket listener
   * after success the lights will be loaded into the state to make this
   * component a standalone module
   * we also handle fisrt usage here since it requires come server configuration
   */
  componentWillMount() {
    this.props.socket.emit('MountHueBridge');
    this.props.socket.on('ConnectHueBridge', (connected) => {
      if (connected) {
        return
      }
      this.setState({
        prompt: true
      });
    });
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

  // unregister socket events before unmounting
  componentWillUnmount() {
    this.props.socket.off('HueBridge');
    this.props.socket.off('ConnectHueBridge');
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

  confirmBridgeLink() {
    this.setState({
      prompt: false
    });
    this.props.socket.emit('ConnectHueBridge');
  }

  render() {
    let connectPrompt;
    if (this.state.prompt) {
      connectPrompt = (
        <div>
          <h2>Connect to bridge</h2>
          <p>
            Click the Link button on your bridge to connect, then click ok within 30 seconds
          </p>
          <button onClick={ this.confirmBridgeLink }>
            ok
          </button>
        </div>
      );
    }
    return (
      <div>
        <h2>Lights (Phillips hue)</h2>
        { connectPrompt }
        <div style={ {  display: 'flex'} }>
          { this.getLights(this.state.lights) }
        </div>
      </div>
      );
  }
}


export default HueBridge
