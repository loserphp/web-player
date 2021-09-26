

import { PlayerEvents } from './player-events.js';
import BasePlayer from './base-player';



export class MP4Player extends BasePlayer {
  constructor(url, container, config) {
    super(url, container, config)
    this.name = 'MP4Player'

    this.e = {
      onvLoadedMetadata: this._onvLoadedMetadata.bind(this),
      trigger: this._trigger.bind(this)
    };

    this._pendingSeekTime = null;
    this._statisticsReporter = null;

    // this._mediaElement = null;
    super.createMediaElement(this._config.url)
  }

  destroy () {
    if (this._mediaElement) {
      this.unload();
      this.detachMediaElement();
    }
    this.e = null;
    this._emitter.removeAllListeners();
    this._emitter = null;

    this.eventControl.destroy()
    this.eventControl = null
  }

  on (event, listener) {
    if (event === PlayerEvents.MEDIA_INFO) {
      if (this._mediaElement != null && this._mediaElement.readyState !== 0) {  // HAVE_NOTHING
        Promise.resolve().then(() => {
          this._emitter.emit(PlayerEvents.MEDIA_INFO, this.mediaInfo);
        });
      }
    } else if (event === PlayerEvents.STATISTICS_INFO) {
      if (this._mediaElement != null && this._mediaElement.readyState !== 0) {
        Promise.resolve().then(() => {
          this._emitter.emit(PlayerEvents.STATISTICS_INFO, this.statisticsInfo);
        });
      }
    }
    this._emitter.addListener(event, listener);
  }

  off (event, listener) {
    this._emitter.removeListener(event, listener);
  }

  attachMediaElement (mediaElement) {
    // this._mediaElement = mediaElement;
    mediaElement.addEventListener('loadedmetadata', this.e.onvLoadedMetadata);

    if (this._pendingSeekTime != null) {
      try {
        mediaElement.currentTime = this._pendingSeekTime;
        this._pendingSeekTime = null;
      } catch (e) {
        // IE11 may throw InvalidStateError if readyState === 0
        // Defer set currentTime operation after loadedmetadata
      }
    }

  }

  detachMediaElement () {

    if (this._mediaElement) {
      this._mediaElement.src = '';
      this._mediaElement.removeAttribute('src');
      this._mediaElement.removeEventListener('loadedmetadata', this.e.onvLoadedMetadata);
      this._mediaElement = null;
    }
    if (this._statisticsReporter != null) {
      window.clearInterval(this._statisticsReporter);
      this._statisticsReporter = null;
    }

    this.stopAnimation()
    this._ctx.clearRect(0, 0, this.width * this._dpx, this.height * this._dpx)
  }

  load () {
    if (!this._mediaElement) {
      throw new Error('HTMLMediaElement must be attached before load()!');
    }
    this._mediaElement.src = this._mediaDataSource.url;

    if (this._mediaElement.readyState > 0) {
      this._mediaElement.currentTime = 0;
    }

    this._mediaElement.preload = 'auto';
    this._mediaElement.load();
    this._statisticsReporter = window.setInterval(
      this._reportStatisticsInfo.bind(this),
      this._config.statisticsInfoReportInterval);

  }

  unload () {
    if (this._mediaElement) {
      this._mediaElement.src = '';
      this._mediaElement.removeAttribute('src');
    }
    if (this._statisticsReporter != null) {
      window.clearInterval(this._statisticsReporter);
      this._statisticsReporter = null;
    }
  }

  play () {
    return this._mediaElement.play();
  }

  pause () {
    this._mediaElement.pause();
  }

  _trigger () {
    if (this._mediaElement.paused) {
      this.play()
    } else {
      this.pause()
    }
  }

  get type () {
    return this._type;
  }

  get buffered () {
    return this._mediaElement.buffered;
  }

  get duration () {
    return this._mediaElement.duration;
  }

  get volume () {
    return this._mediaElement.volume;
  }

  set volume (value) {
    this._mediaElement.volume = value;
  }

  get muted () {
    return this._mediaElement.muted;
  }

  set muted (muted) {
    this._mediaElement.muted = muted;
  }

  get currentTime () {
    if (this._mediaElement) {
      return this._mediaElement.currentTime;
    }
    return 0;
  }

  set currentTime (seconds) {
    if (this._mediaElement) {
      this._mediaElement.currentTime = seconds;
    } else {
      this._pendingSeekTime = seconds;
    }
  }

  get mediaInfo () {
    let mediaPrefix = (this._mediaElement instanceof HTMLAudioElement) ? 'audio/' : 'video/';
    let info = {
      mimeType: mediaPrefix + this._config.type
    };
    if (this._mediaElement) {
      info.duration = Math.floor(this._mediaElement.duration * 1000);
      if (this._mediaElement instanceof HTMLVideoElement) {
        info.width = this._mediaElement.videoWidth;
        info.height = this._mediaElement.videoHeight;
      }
    }
    return info;
  }

  get statisticsInfo () {
    let info = {
      playerType: this._type,
      url: this._mediaDataSource.url
    };

    if (!(this._mediaElement instanceof HTMLVideoElement)) {
      return info;
    }

    let hasQualityInfo = true;
    let decoded = 0;
    let dropped = 0;

    if (this._mediaElement.getVideoPlaybackQuality) {
      let quality = this._mediaElement.getVideoPlaybackQuality();
      decoded = quality.totalVideoFrames;
      dropped = quality.droppedVideoFrames;
    } else if (this._mediaElement.webkitDecodedFrameCount != undefined) {
      decoded = this._mediaElement.webkitDecodedFrameCount;
      dropped = this._mediaElement.webkitDroppedFrameCount;
    } else {
      hasQualityInfo = false;
    }

    if (hasQualityInfo) {
      info.decodedFrames = decoded;
      info.droppedFrames = dropped;
    }

    return info;
  }

  _onvLoadedMetadata (e) {
    if (this._pendingSeekTime != null) {
      this._mediaElement.currentTime = this._pendingSeekTime;
      this._pendingSeekTime = null;
    }
    this._emitter.emit(PlayerEvents.MEDIA_INFO, this.mediaInfo);

    this._config.videoWidth = this._mediaElement.videoWidth
    this._config.videoHeight = this._mediaElement.videoHeight
    this._config.videoRate = this._config.videoWidth / this._config.videoHeight

    this.onWindowResize()
  }

  _reportStatisticsInfo () {
    this._emitter.emit(PlayerEvents.STATISTICS_INFO, this.statisticsInfo);
  }

}
