import React from 'react';
import classNames from 'classnames';
import color from 'color';
import Radium from 'radium';

// components
import ColorPicker from '../../../../components/ColorPicker/ColorPicker.jsx'

var style = {
  HueLight: {
    padding: '10px'
  },
  swatch: (color, on) => ({
    display: 'inline-block',
    margin: '.5em',
    height: '2em',
    width: '2em',
    borderRadius: '2em',
    backgroundColor: on ? `hsl(${color})` : '#000',
    boxShadow: on ? `0 2px 3px rgba(0,0,0,.7), 0 0 1em 1px hsla(${color},.7)` : false,
  }),
  topControls: {
    display: 'flex',
    alignItems: 'center',
  }
}

@Radium
class HueLight extends React.Component {
  constructor(props) {
    super(props);

    // bind methods
    this.lightsOn = this.lightsOn.bind(this);
    this.lightsOff = this.lightsOff.bind(this);
    this.setColorState = this.setColorState.bind(this);
    this.sendColorState = this.sendColorState.bind(this);
    this.revertColorState = this.revertColorState.bind(this);
    this.colorDisplay = this.colorDisplay.bind(this);

    // allow and set initial state
    this.state = {
      on: props.on,
      h: props.h,
      s: props.s,
      l: props.l
    }

    // set helpers
    this.hueRange = 65535;
    this.satRange = 254;
    this.briRange = 254;
  }

  /**
   * make sure the state is updtated if new data is received
   * @param  {Object} newProps the new props before active
   */
  componentWillReceiveProps(newProps) {
    this.setState({
      on: newProps.on,
      h: newProps.h,
      s: newProps.s,
      l: newProps.l
    })
  }

  /**
   * set the internal state of colors
   * @param {Object}  hsl sets internal color state
   */
  setColorState(hsl) {
    this.setState(hsl)
  }

  /**
   * send the internal state of colors to the Bridge
   * @param {Object}  hsl sends internal color state
   */
  sendColorState(hsl) {
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(this.props.id, hsl);
    }
  }

  /**
   * revert to current light
   */
  revertColorState() {
    this.setState({
      h: this.props.h,
      s: this.props.s,
      l: this.props.l
    })
  }

  /**
   * switch the light on
   */
  lightsOn() {

    // internal
    this.setState({
      on: true
    });

    // external
    if (typeof this.props.toggle === 'function') {
      this.props.toggle(this.props.id, 'on');
    }
  }

  /**
   * switch lights off
   */
  lightsOff() {

    // internal
    this.setState({
      on: false
    });

    // external
    if (typeof this.props.toggle === 'function') {
      this.props.toggle(this.props.id, 'off');
    }
  }

  /**
   * display the current state color in a simple display
   * @param  {Object} light  the light in pretty format
   * @return {Element}       returns the display
   */
  colorDisplay() {
    let h = this.state.h / this.hueRange * 359;
    let s = this.state.s / this.satRange * 50 + 25;
    let l = this.state.l / this.briRange * 50 + 25;
    console.log({
      h,
      s,
      l
    })
    let color = `${h},${s}%,${l}%`;
    return <span style={ style.swatch(color, this.state.on) } />
  }

  render() {
    let onOff;
    let colorControl;

    if (this.state.on) {
      onOff = (
        <button onClick={ this.lightsOff }>
          off
        </button>
      );
      colorControl = (
        <div>
          <ColorPicker size={ 200 }
                       hueRange={ this.hueRange }
                       satRange={ this.satRange }
                       briRange={ this.briRange }
                       onMouseMove={ this.setColorState }
                       onClick={ this.sendColorState }
                       onMouseLeave={ this.revertColorState } />
        </div>
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
        <h3>{ this.props.name }</h3>
        <div style={ style.topControls }>
          { this.colorDisplay() }
          { onOff }
        </div>
        { colorControl }
      </div>
      );
  }
}

export default HueLight

