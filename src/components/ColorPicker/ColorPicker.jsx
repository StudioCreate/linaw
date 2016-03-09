import React from 'react';
import classNames from 'classnames';
import Radium from 'radium';
import color from 'color';



class ColorPicker extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.getHSL = this.getHSL.bind(this);
    this.createContext = this.createContext.bind(this);
  }

  /**
   * create context when mounted
   */
  componentDidMount() {
    this.createContext();
  }

  /**
   * creates a context  and adds a colorfield
   */
  createContext() {
    this.refs.canvas.height = this.props.size;
    this.refs.canvas.width = this.props.size;
    let ctx = this.refs.canvas.getContext('2d');

    // create a gradient for each hue step
    for (let i = 0; i < this.props.size; i++) {
      let gradient = ctx.createLinearGradient(0, 0, 0, this.refs.canvas.height);
      gradient.addColorStop(0, `hsl(${360 / this.props.size * i},100%,10%)`);
      gradient.addColorStop(.5, `hsl(${360 / this.props.size * i},100%,50%)`);
      gradient.addColorStop(1, `hsl(${360 / this.props.size * i},100%,80%)`);

      ctx.fillStyle = gradient;
      ctx.fillRect(i, 0, i + 1, this.refs.canvas.height);
    }
  }

  /**
   * get the current color value and return to parent
   * @param  {Event} e event that triggered the method
   */
  handleMouseMove(e) {
    if (typeof this.props.onMouseMove === 'function') {
      this.props.onMouseMove(this.getHSL(e));
    }
  }

  /**
   * get the current color value and return to parent
   * @param  {Event} e event that triggered the method
   */
  handleClick(e) {
    if (typeof this.props.onClick === 'function') {
      this.props.onClick(this.getHSL(e));
    }
  }

  /**
   * get the HSL value of the coordinate
   * @param  {Event} e event that triggered the method
   * @return {Object}   returns {h,s,l}
   */
  getHSL(e){
    let x = e.nativeEvent.layerX;
    let y = e.nativeEvent.layerY;
    let h = x / this.props.size * this.props.hueRange;
    let s = y / this.props.size * this.props.satRange;
    let l = y / this.props.size * this.props.briRange;
    return {h,s,l}
  }

  render() {
    return (
      <div>
        <canvas onMouseMove={ this.handleMouseMove }
                onClick={ this.handleClick }
                onMouseLeave={ this.props.onMouseLeave }
                ref='canvas' />
      </div>
      );
  }
}

export default ColorPicker