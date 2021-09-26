import { videoEvents } from '../player/player-events'
import EventEmitter from 'events';

/**
 * 视频事件注册、取消
 */
export class EventControl {
  constructor(_config) {
    this.name = 'EventControl'

    this._mediaElement = _config._mediaElement
    this._emitter = _config._emitter

    this.e = {
      videoPause: this._videoPause.bind(this),
      videoPlay: this._videoPlay.bind(this),
      videoLoadstart: this._videoLoadstart.bind(this),
      videoProgress: this._videoProgress.bind(this),
      videoLoadeddata: this._videoLoadeddata.bind(this),
      videoLoadedmetadata: this._videoLoadedmetadata.bind(this),
      videoAbort: this._videoAbort.bind(this),
      videoError: this._videoError.bind(this),
      videoStalled: this._videoStalled.bind(this),
      videoWaiting: this._videoWaiting.bind(this),
      videoCanplay: this._videoCanplay.bind(this),
      videoPlaying: this._videoPlaying.bind(this),
      videoCanplaythrough: this._videoCanplaythrough.bind(this),
      videoSeeking: this._videoSeeking.bind(this),
      videoSeeked: this._videoSeeked.bind(this),
      videoTimeupdate: this._videoTimeupdate.bind(this),
      videoEnded: this._videoEnded.bind(this),
      videoRatechange: this._videoRatechange.bind(this),
      videoEnded: this._videoEnded.bind(this),
    };

    this.init()

  }

  init () {
    try {
      const keys = Object.keys(videoEvents)
      keys.map((item) => {
        this._mediaElement.addEventListener(
          videoEvents[item],
          this.e['video' + this.upperFChart(videoEvents[item])]
        )
      })
    } catch (error) {
      throw new Error(`${this.name} addEventListener error :`, error)
    }
    // this._emitter.addListener(event, listener);
  }


  upperFChart (str) {
    var reg = /\b(\w)|\s(\w)/g
    str = str.toLowerCase()
    return str.replace(reg, function (m) {
      return m.toUpperCase()
    })
  }

  destroy () {
    const keys = Object.keys(videoEvents)
    keys.map((item) => {
      this._mediaElement.removeEventListener(
        videoEvents[item],
        this.e['video' + this.upperFChart(videoEvents[item])].bind(this)
      )
    })

    this.e = null;
  }

  _videoPause (e) {
    this._emitter.emit(videoEvents.VIDEO_PAUSE, e);
  }

  _videoPlay (e) {
    this._emitter.emit(videoEvents.VIDEO_PLAY, e);
  }

  _videoLoadstart (e) {
    this._emitter.emit(videoEvents.VIDEO_LOADSTART, e);
  }

  _videoProgress (e) {
    this._emitter.emit(videoEvents.VIDEO_PROGRESS, e);
  }

  _videoLoadeddata (e) {
    this._emitter.emit(videoEvents.VIDEO_LOADEDDATA, e);
  }

  _videoLoadedmetadata (e) {
    this._emitter.emit(videoEvents.VIDEO_LOADEDMETADATA, e);
  }

  _videoAbort (e) {
    this._emitter.emit(videoEvents.VIDEO_ABORT, e);
  }

  _videoError (e) {
    this._emitter.emit(videoEvents.VIDEO_ERROR, e);
  }

  _videoStalled (e) {
    this._emitter.emit(videoEvents.VIDEO_STALLED, e);
  }

  _videoWaiting (e) {
    this._emitter.emit(videoEvents.VIDEO_WAITING, e);
  }

  _videoCanplay (e) {
    this._emitter.emit(videoEvents.VIDEO_CANPLAY, e);
  }

  // 在媒体开始播放时触发（不论是初次播放、在暂停后恢复、或是在结束后重新开始）
  _videoPlaying (e) {
    this._emitter.emit(videoEvents.VIDEO_PLAYING, e);
  }

  _videoCanplaythrough (e) {
    this._emitter.emit(videoEvents.VIDEO_CANPLAYTHROUGH, e);
  }

  _videoSeeking (e) {
    this._emitter.emit(videoEvents.VIDEO_SEEKING, e);
  }

  _videoSeeked (e) {
    this._emitter.emit(videoEvents.VIDEO_SEEKED, e);
  }

  _videoTimeupdate (e) {
    this._emitter.emit(videoEvents.VIDEO_TIMEUPDATE, e.target.currentTime);
  }

  _videoEnded (e) {
    this._emitter.emit(videoEvents.VIDEO_ENDED, e);
  }

  _videoRatechange (e) {
    this._emitter.emit(videoEvents.VIDEO_RATECHANGE, e);
  }

  _videoVolumechange (e) {
    this._emitter.emit(videoEvents.VIDEO_VOLUMECHANGE, e);
  }
}
