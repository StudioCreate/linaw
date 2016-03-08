import React from 'react';
import classNames from 'classnames';
import Radium from 'radium';
import color from 'color';


@Radium
/**
 * the SonosPlayer component
 * @class SonosPlayer
 */
class SonosPlayer extends React.Component {

  constructor(props) {
    super(props);

    // bind methods

    this.setAudioVolume = this.setAudioVolume.bind(this);
    this.handleAction = this.handleAction.bind(this);

    // allow and set initial state
    this.state = {}
  }

  /**
   * send volume level to Sonos
   * @param {Object} player  the Sonos player
   * @param {Event}  e       event that triggered this method
   */
  setAudioVolume(player, e) {
    this.props.socket.emit('volume', player, e.target.value);
  }

  /**
   * handle actions as 'play', 'pause' etc.
   * @param {Object} player  the Sonos player
   * @param {String} type    type of action
   * @param {Event}  e       event that triggered this method
   */
  handleAction(player, type, e) {
    this.props.socket.emit(type, player);
  }

  render() {
    return (


      <div>
        <h2>Audio (Sonos)</h2>
        <button onClick={ this.handleAction.bind(this, 0, 'play') }>
          play
        </button>
        <button onClick={ this.handleAction.bind(this, 0, 'pause') }>
          pause
        </button>
        <h3>Play:3</h3>
        <input type='range'
               min={ 0 }
               max={ 100 }
               defaultValue={ 10 }
               onChange={ this.setAudioVolume.bind(this, 1) } />
        <h3>Play:5</h3>
        <input type='range'
               min={ 0 }
               max={ 100 }
               defaultValue={ 10 }
               onChange={ this.setAudioVolume.bind(this, 0) } />
      </div>
      );
  }
}


export default SonosPlayer;
