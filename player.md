
参考：https://cloud.tencent.com/document/product/881/20207

### 播放器参数
```javscript
  var player = new WebPlayer(url,container||{
    container:dom,
    poster:'xxx'||{style:'stretch',src:'xxx'},
    autoplay:true,
    width:480,
    height:320,
    volume:0.5,
    live:false, // 是否直播，控制控件显示和逻辑
    controls:true,
    flvConfig:{},
    hlsConfig:{},
    vrConfig:{},
    webrtcConfig:{}

  })

```

### 支持格式
- H264 MP4
- H265 MP4
- H264 FLV 点直播
- H265 FLV 点直播
- HLS 点直播
- DASH
- MPEG-2 TS
- RTMP


### 事件
- error
- timeupdate
- load
- loadedmetadata
- loadeddata
- progress
- fullscreen
- play
- playing
- pause
- ended
- seeking
- seeked
- resize
- volumechange
- webrtcstatupdate
- webrtcwaitstart
- webrtcwaitend
- webrtcstop

### 方法

- play
- pause
- setMute(boolean)
- setVolume(number)
- setCurrentTime(time)
- getPlaying
- getDuration
- getBuffered
- fullScreen
- load(url)
- switchClarity(s)

### 参考：

- 七牛云： https://developer.qiniu.com/pili/7730/geek-web-sdk
- 视频rotate属性： https://blog.csdn.net/lhtzbj12/article/details/53538857

