
import Polyfill from './utils/polyfill.js';


// install polyfills
Polyfill.install();

const WebPlayer = {
  createPlayer (url, dom, config) {
    const options = {
      type: 'mp4'
    }

    switch (options.type) {
      case 'mp4':
        return new MP4Player(options)
      case 'flv':
        return new FLVPlayer(options)
      case 'hls':
        return new HLSPlayer(options)
      default:
        break;
    }
  },
  install (plugin) {
    WebPlayer.prototype.plugin = plugin
  },
  mount (id = '#web-player') {
    // 
  }
  // 其他的一些静态方法和枚举
}

Object.defineProperty(WebPlayer, 'version', {
  enumerable: true,
  get: function () {
    // replace by webpack.DefinePlugin
    return __VERSION__;
  }
});

export default WebPlayer