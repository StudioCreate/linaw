import React from 'react';
import classNames from 'classnames';
import Radium from 'radium';
import color from 'color';

@Radium
/**
 * the LGRemote component
 * @class LGRemote
 * @property {Socket} socket a socket shared connection
 */
class LGRemote extends React.Component {

  constructor(props) {
    super(props);
    // allow and set initial state
    this.state = {}
  }

  render() {
    return (
      <div>
        <h2>LG Remote</h2>
      </div>
      );
  }
}


export default LGRemote
