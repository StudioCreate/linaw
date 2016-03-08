import React from 'react';

// module components
import HueBridge from '../modules/PhillipsHue/components/HueBridge/HueBridge.jsx';
import SonosPlayer from '../modules/Sonos/components/SonosPlayer/SonosPlayer.jsx';
import LGRemote from '../modules/LGWebOS/components/LGRemote/LGRemote.jsx';

const MODULES = {
  'PhillipsHue': (key, socket) => (
  <HueBridge key={ key }
             socket={ socket } />
  ),
  'Sonos': (key, socket) => (
  <SonosPlayer key={ key }
               socket={ socket } />
  ),
  'LGWebOS': (key, socket) => (
  <LGRemote key={ key }
            socket={ socket } />
  ),
};

export default MODULES