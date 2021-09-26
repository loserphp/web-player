export const defaultConfig = {
  url: '',
  container: document.getElementById('web-player'),

  // enableWorker: false,
  // enableStashBuffer: true,
  // stashInitialSize: undefined,

  // isLive: false,

  // lazyLoad: true,
  // lazyLoadMaxDuration: 3 * 60,
  // lazyLoadRecoverDuration: 30,
  // deferLoadAfterSourceOpen: true,

  // autoCleanupSourceBuffer: default as false, leave unspecified
  // autoCleanupMaxBackwardDuration: 3 * 60,
  // autoCleanupMinBackwardDuration: 2 * 60,

  // statisticsInfoReportInterval: 600,

  // fixAudioTimestampGap: true,

  // accurateSeek: false,
  // seekType: 'range',  // [range, param, custom]
  // seekParamStart: 'bstart',
  // seekParamEnd: 'bend',
  // rangeLoadZeroStart: false,
  // customSeekHandler: undefined,
  // reuseRedirectedURL: false,
  // referrerPolicy: leave as unspecified

  // headers: undefined,
  // customLoader: undefined,

  _emitter: null,

  videoWidth: 0,
  videoHeight: 0,
  videoRate: 16 / 9,
  autoplay: true,
  type: 'mp4',

  flvMediaData: {
    type: 'flv',
    // 其他非必传
  },
  flvConfig: {
    autoCleanupSourceBuffer: false,
    autoCleanupMaxBackwardDuration: 3 * 60,
    autoCleanupMinBackwardDuration: 2 * 60,
    fixAudioTimestampGap: true,
    // 其他非必传
  },
  // Hls.DefaultConfig
  hlsConfig: {
  }
};

export function createDefaultConfig () {
  return Object.assign({}, defaultConfig);
}