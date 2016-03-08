import React from 'react';
import classNames from 'classnames';
import color from 'color';
import Radium from 'radium';

var style = {
  HueLight: {
    padding: '10px'
  },
  swatch: (color) => ({
    display: 'inline-block',
    margin: '.5em',
    height: '2em',
    width: '6em',
    borderRadius: '2em',
    border: '1px solid currentColor',
    backgroundColor: `hsl(${color})`,
  })
}

@Radium
class HueLight extends React.Component {
  constructor(props) {
    super(props);

    // bind methods
    this.lightsOn = this.lightsOn.bind(this);
    this.lightsOff = this.lightsOff.bind(this);
    this.setColorState = this.setColorState.bind(this);
    this.colorDisplay = this.colorDisplay.bind(this);

    // allow and set initial state
    this.state = {
      light: props.light
    }

    // set helpers
    this.hueRange = 65535;
  }

  /**
   * make sure the state is updtated if new data is received
   * @param  {Object} newProps the new props before active
   */
  componentWillReceiveProps(newProps) {
    this.setState({
      light: newProps.light
    })
  }

  /**
   * set the internal state of the slider values
   * @param {String}  prop the lightProperty to change
   * @param {Boolean} send if true send external via sockets
   *                       this flag will help prevent overload on the bridge
   * @param {Event}   e    the event that triggered the method
   */
  setColorState(prop, send, e) {
    let light = this.state.light;
    let value = e.target.value;
    light[prop] = value;

    // internal
    this.setState({
      light: light
    })

    // external
    if (send && typeof this.props.onChange === 'function') {
      this.props.onChange(light);
    }
  }

  /**
   * switch the light on
   */
  lightsOn() {
    let light = this.state.light;
    light.on = true;

    // internal
    this.setState({
      light: light
    });

    // external
    if (typeof this.props.toggle === 'function') {
      this.props.toggle(light, 'on');
    }
  }

  /**
   * switch lights off
   */
  lightsOff() {

    let light = this.state.light;
    light.on = false;

    // internal
    this.setState({
      light: light
    });

    // external
    if (typeof this.props.toggle === 'function') {
      this.props.toggle(light, 'off');
    }
  }

  /**
   * display the current state color in a simple display
   * @param  {Object} light  the light in pretty format
   * @return {Element}       returns the display
   */
  colorDisplay(light) {
    // convert color values
    let h = light.hue / this.hueRange * 360;
    let s = light.saturation / 255 * 100;
    // fake the lightness since the Hue bulbs 
    // always have color if saturated
    let l = light.brightness / 255 * 50 + 25;
    let color = `${h},${s}%,${l}%`;

    return <span style={ style.swatch(color) } />
  }

  render() {
    let onOff;

    if (this.state.light.on) {
      onOff = (
        <button onClick={ this.lightsOff }>
          off
        </button>
      );
    } else {
      onOff = (
        <button onClick={ this.lightsOn }>
          on
        </button>
      );
    }

    return (
      <div style={ style.HueLight }>
        <h3>{ this.state.light.name } { this.colorDisplay(this.state.light) }</h3>
        { onOff }
        <h3>h</h3>
        <input type='range'
               min={ 0 }
               max={ this.hueRange }
               value={ this.state.light.hue }
               onChange={ this.setColorState.bind(this, 'hue', false) }
               onMouseUp={ this.setColorState.bind(this, 'hue', true) } />
        <h3>s</h3>
        <input type='range'
               min={ 0 }
               max={ 255 }
               value={ this.state.light.saturation }
               onChange={ this.setColorState.bind(this, 'saturation', false) }
               onMouseUp={ this.setColorState.bind(this, 'saturation', true) } />
        <h3>l</h3>
        <input type='range'
               min={ 0 }
               max={ 255 }
               value={ this.state.light.brightness }
               onChange={ this.setColorState.bind(this, 'brightness', false) }
               onMouseUp={ this.setColorState.bind(this, 'brightness', true) } />
      </div>
      );
  }
}

export default HueLight

