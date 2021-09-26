import EventEmitter from 'events';
import { createDefaultConfig } from '../config'
import { getUrlInfo } from '../utils/util'
import { UIControl, EventControl, CatchControl } from "../control";

export default class BasePlayer {
  constructor(url, container, config) {

    this._config = createDefaultConfig()
    Object.assign(this._config,
      { url, container, type: getUrlInfo(url).type },
      config,
      { flvMediaData: { ...this._config.flvMediaData, ...config.flvMediaData } },
      { flvConfig: { ...this._config.flvConfig, ...config.flvConfig } },
      { hlsConfig: { ...Hls.DefaultConfig, ...config.hlsConfig } }
    )

    this._config._emitter = new EventEmitter();
    Object.defineProperty(this, '_emitter', {
      get () {
        return this._config._emitter
      },
      set (v) {
        this._config._emitter = v
      }
    })

    this._requestAnimationId = null
    this._throttle = true
    this._catchControl = new CatchControl(this._config)

    this.onWindowResize = this._onWindowResize.bind(this)
    window.addEventListener('resize', this.onWindowResize)

  }

  createMediaElement (src) {
    var mediaElement = document.createElement('video')
    mediaElement['webkit-playsinline'] = true
    mediaElement['playsinline'] = 'playsinline'
    mediaElement['x-webkit-airplay'] = true
    mediaElement.src = src

    this._config._mediaElement = mediaElement

    Object.defineProperty(this, '_mediaElement', {
      get () {
        return this._config._mediaElement
      },
      set (mediaElement) {
        this._config._mediaElement = mediaElement
      }
    })

    this.attachMediaElement(this._mediaElement)
    this.eventControl = new EventControl(this._config)
    this.uiControl = new UIControl(this._config)

    if (this._config.type == 'flv') {
      this.flvPlayer = flvjs.createPlayer({
        ...this._config.flvMediaData,
        type: 'flv',
        url: src
      }, {
        ...this._config.flvConfig,
      });
      this.flvPlayer.attachMediaElement(mediaElement);
      this.flvPlayer.load();
    } else if (this._config.type == 'hls') {
      this.hlsPlayer = new Hls(this._config.hlsConfig);
      this.hlsPlayer.loadSource(src);
      this.hlsPlayer.attachMedia(mediaElement);
      this.hlsPlayer.on(Hls.Events.MEDIA_ATTACHED, function () {
        console.log('video and hls.js are now bound together !');
      });
    }

    this.createCanvas()
    this._config.container.appendChild(this._canvasElement)
    this._config.container.style.position = 'relative'
    this.startAnimation()

    if (this._config.autoplay) {
      this.play()
    }
  }

  createCanvas () {
    this._canvasElement = document.createElement('canvas')
    this._canvasElement.style = "height:100%;width:100%;background:black;"
    this._ctx = this._canvasElement.getContext('2d')
    this._dpx = window.devicePixelRatio

    this._canvasElement.addEventListener('click', this.e.trigger)
  }

  _onWindowResize () {
    if (this._throttle) {
      this._throttle = false
      setTimeout(() => {
        this._throttle = true
      }, 200)
    } else {
      return
    }

    let offsetWidth = this._config.container.offsetWidth
    this.width = offsetWidth
    this.height = offsetWidth / this._config.videoRate

    this._canvasElement.width = this.width * this._dpx
    this._canvasElement.height = this.height * this._dpx

    this._canvasElement.style.width = this.width + 'px'
    this._canvasElement.style.height = this.height + 'px'
  }




  startAnimation () {
    if (this._requestAnimationId) return
    this.animate()
  }

  stopAnimation () {
    window.cancelAnimationFrame(this._requestAnimationId)
    this._requestAnimationId = null
  }

  animate () {
    this.render()
    this._requestAnimationId = window.requestAnimationFrame(
      this.animate.bind(this)
    )
  }

  render () {
    this._ctx.drawImage(this._mediaElement, 0, 0, this.width * this._dpx, this.height * this._dpx)
  }



}