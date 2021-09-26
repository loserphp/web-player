
// import Polyfill from './utils/polyfill.js';
import { getUrlInfo } from './utils/util'
import { PlayerEvents, videoEvents } from './player/player-events'
import { MP4Player, FLVPlayer, HLSPlayer } from './player/index'
import './asset/index.less'

// install polyfills
// Polyfill.install();

window.webPlayer = {
  createPlayer (url, container, config) {

    const { type } = getUrlInfo(url)

    switch (type) {
      case 'mp4':
        return new MP4Player(url, container, config)
      case 'flv':
        return new FLVPlayer(url, container, config)
      case 'hls':
        return new HLSPlayer(url, container, config)
      default:
        break;
    }
  },
  install (plugin) {
    plugin.install.apply(this)
  },
}

webPlayer.PlayerEvents = PlayerEvents
webPlayer.videoEvents = videoEvents

Object.defineProperty(webPlayer, 'version', {
  enumerable: true,
  get: function () {
    return __VERSION__;
  }
});

export default webPlayer
