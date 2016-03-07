import React from 'react';
import classNames from 'classnames';
import color from 'color';
import Radium from 'radium';

var style = {
  HueLight: {
    padding: '10px'
  },
  swatch: (color)=>({
    display: 'inline-block',
    margin: '.5em',
    height: '2em',
    width: '6em',
    borderRadius: '2em',
    border: '1px solid currentColor',
    backgroundColor: `hsl(${color})`,
  }),
  button: (on, c, b) => ({
    backgroundColor: on ? c : b,
    color: on ? b : c
  })
}

@Radium
class HueLight extends React.Component {
  constructor(props) {
    super(props);
    this.lightsOn = this.lightsOn.bind(this);
    this.lightsOff = this.lightsOff.bind(this);
    this.setColorState = this.setColorState.bind(this);
    this.sendColorState = this.sendColorState.bind(this);
    this.state = {
      light: props.light
    }

    // set helpers
    this.backgroundColor = '#010102';
    this.color = '#fefefe';
    this.hueRange = 65535;

  }

  componentWillReceiveProps(newProps) {
    this.setState({
      light: newProps.light
    })
  }

  /**
   * set the internal state of the slider values
   * @param {String}        prop the lightProperty to change[description]
   * @param {Event}         e    the event that triggered the method
   */
  setColorState(prop, e) {
    let light = this.state.light;
    let value = e.target.value;
    light[prop] = value;
    this.setState({
      light: light
    })
  }

  /**
  * send the internal state to the parent component
  * @param {String}  prop the lightProperty to change[description]
  * @param {Event}   e    the event that triggered the method
  */
  sendColorState(prop, e) {
    let light = this.state.light;
    let value = e.target.value;
    light[prop] = value;
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(light);
    }
  }

  /**
   * switch the light on
   */
  lightsOn() {
    let light = this.state.light;
    light.on = true;
    this.setState({
      light: light
    });
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
    this.setState({
      light: light
    });
    if (typeof this.props.toggle === 'function') {
      this.props.toggle(light, 'off');
    }
  }

  render() {
    let color = `
          ${this.state.light.hue / this.hueRange * 360},
          ${this.state.light.saturation / 255 * 100}%,
          ${this.state.light.brightness / 255 * 50 + 25}%`;

    return (
      <div style={ style.HueLight }>
        <h3>{ this.state.light.name } <span style={ style.swatch(color) }/></h3>
        <button onClick={ this.lightsOn }
                style={ style.button(this.state.light.on, this.color, this.backgroundColor) }>
          on
        </button>
        <button onClick={ this.lightsOff }
                style={ style.button(!this.state.light.on, this.color, this.backgroundColor) }>
          off
        </button>
        <h3>h</h3>
        <input type='range'
               min={ 0 }
               max={ this.hueRange }
               value={ this.state.light.hue }
               onChange={ this.setColorState.bind(this, 'hue') }
               onMouseUp={ this.sendColorState.bind(this, 'hue') } />
        <h3>s</h3>
        <input type='range'
               min={ 0 }
               max={ 255 }
               value={ this.state.light.saturation }
               onChange={ this.setColorState.bind(this, 'saturation') }
               onMouseUp={ this.sendColorState.bind(this, 'saturation') } />
        <h3>l</h3>
        <input type='range'
               min={ 0 }
               max={ 255 }
               value={ this.state.light.brightness }
               onChange={ this.setColorState.bind(this, 'brightness') }
               onMouseUp={ this.sendColorState.bind(this, 'brightness') } />
      </div>
      );
  }
}

export default HueLight

