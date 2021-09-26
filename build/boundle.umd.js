(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.boundle = factory());
}(this, (function () { 'use strict';

  // import Polyfill from './utils/polyfill.js';


  // install polyfills
  // Polyfill.install();

  const WebPlayer = {
    createPlayer (url, dom, config) {
    },
    install (plugin) {
      WebPlayer.prototype.plugin = plugin;
    },
    mount (id = '#web-player') {
      // 
    }
    // 其他的一些静态方法和枚举
  };

  Object.defineProperty(WebPlayer, 'version', {
    enumerable: true,
    get: function () {
      // replace by webpack.DefinePlugin
      return __VERSION__;
    }
  });

  return WebPlayer;

})));
