/**
 * LInAW
 * React.js powered client for the LInAW app
 */

import React from 'react';
import reactDOM from 'react-dom';
import classNames from 'classnames';
import Radium from 'radium';
import color from 'color';

// socket
const socket = require('socket.io-client')('http://localhost:8080');

// object structured data
import MODULES from './MODULES';
import DUMMYPROPS from './DUMMYPROPS';
import STYLE from './STYLE';

@Radium
/**
 * the LInAW component
 * @class LInAW
 */
class LInAW extends React.Component {

  constructor(props) {
    super(props);

    // allow and set initial state
    this.state = {
      modules: DUMMYPROPS.modules,
    }
  }

  /**
   * get the module
   * this method returns components that offer communication
   * @param  {Object} data   module config
   * @param  {String} module module key
   * @return {Component}     returns a corresponding component to a module
   */
  getModule(module) {
    if (!this.state.modules[module]) {
      return
    }
    // get the module from the registered modules list
    return MODULES[this.state.modules[module].module.id](module,socket);
  }

  /**
   * returns all modules that are loaded in the current state of the app
   * @return {Array} a list of modules to display
   */
  getModules() {
    let configuredModules = [];
    for (let module in this.state.modules) {
      configuredModules.push(this.getModule(module));
    }
    return configuredModules
  }

  /**
   * set the module
   * displays the module selected from the navigation
   * @param  {Object} module   module key
   */
  setModule(module) {
    // get the module from the registered modules list
    this.setState({
      module: module
    })
  }

  /**
   * returns all modules as navigation links
   * @return {Element} returns a DOM element with links
   */
  getNavigation(modules) {
    let links = [];
    for (let module in modules) {
      links.push(
        <div key={ module }
            style={STYLE.navLink(this.state.module === module)}
            onClick={this.setModule.bind(this,module)}>
          {module}
        </div>
      );
    }
    return (
      <div style={STYLE.nav}>{links}</div>
      );
  }

  /**
   * render app
   * @return {Component} returns the component
   */
  render() {
    return (
      <div className={ 'LInaW-client' }
           style={ STYLE.LInAW }>
        <div style={ STYLE.header }>
          LInAW
          {this.getNavigation(this.state.modules)}
        </div>
        <div style={ STYLE.body }>
          { this.getModule(this.state.module) }
        </div>
      </div>
      );
  }
}

// render the app
reactDOM.render(<LInAW/>, document.getElementById('LInAW'));
