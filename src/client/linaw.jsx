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
   * currently hardcoded prototypes to test the interaction
   * ths method should return components that offer communication
   * @param  {Object} data   module config
   * @param  {String} module module key
   * @return {Component}     returns a corresponding component to a module
   */
  getModule(data, module) {
    // get the module from the registered modules list
    return MODULES[data.module.id](module,socket);
  }

  /**
   * returns all modules that are loaded in the current state of the app
   * @return {Array} a list of modules to display
   */
  getModules(modules) {
    let configuredModules = [];
    for (let module in modules) {
      configuredModules.push(this.getModule(modules[module], module));
    }
    return configuredModules
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
        </div>
        <div style={ STYLE.body }>
          { this.getModules(this.state.modules) }
        </div>
      </div>
      );
  }
}







// render the app
reactDOM.render(<LInAW/>, document.getElementById('LInAW'));
