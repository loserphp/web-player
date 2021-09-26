const loadingSVG = `
<svg version="1.1" id="L9" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 100 100" enable-background="new 0 0 0 0" xml:space="preserve" width="40" height="40">
    <path fill="#fff" d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50">
      <animateTransform attributeName="transform" attributeType="XML" type="rotate" dur="1s" from="0 50 50" to="360 50 50" repeatCount="indefinite"></animateTransform>
  </path>
</svg>
`

const playSVG = `
<svg t="1631859258981" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8683" xmlns:xlink="http://www.w3.org/1999/xlink" width="40" height="40">
  <defs><style type="text/css"></style></defs>
  <path d="M509.683235 61.691037c-247.329015 0-447.848934 200.519919-447.848934 447.863261 0 247.331062 200.519919 447.852004 447.848934 447.852004 247.331062 0 447.866331-200.519919 447.866331-447.852004C957.549565 262.210957 757.014296 61.691037 509.683235 61.691037zM712.38075 532.75265l0 1.069355-305.282938 201.956641c-4.439102 5.989411-11.513218 9.918907-19.569708 9.918907-13.46364 0-24.408923-10.945283-24.408923-24.437575 0-0.868787 0.157589-1.707898 0.25685-2.548032l-0.25685-0.168846L363.119181 300.56652l0.25685-0.127913c-0.099261-0.868787-0.25685-1.707898-0.25685-2.587941 0-13.507642 10.945283-24.437575 24.408923-24.437575 7.6574 0 14.361079 3.570315 18.872836 9.05012l305.97981 202.811102 0 1.069355c9.907651 3.115967 17.164938 12.268418 17.164938 23.210631C729.545688 520.498558 722.287377 529.651009 712.38075 532.75265z" p-id="8684" fill="#e6e6e6">
  </path>
</svg>
`

export class UIControl {
  constructor(config) {
    this.name = 'UIControl'

    this.config = config
    this.loadingSVG = null
    this.playSVG = null

    this.e = {
      videoPlay: this._videoPlay.bind(this),
      videoPause: this._videoPause.bind(this),
      dblckick2pause: this._dblckick2pause.bind(this)
    }
    this._date = null

    this.init()
  }

  init () {

    this.container = document.createElement('div')
    this.container.className = '__ui__control__'
    this.container.innerHTML = `
      <div class="__ui_control_container__" id="__ui_container__">
        <div class="__control_loading__" hidden>${loadingSVG}</div>
        <div class="__control_play__" >${playSVG}</div>
        <div class="__control_progress__"></div>
      </div>
    `

    this.config.container.appendChild(this.container)

    this.loadingSVG = this.container.querySelector('.__control_loading__')
    this.playSVG = this.container.querySelector('.__control_play__')

    this.container.addEventListener('click', this.e.dblckick2pause)
    this.container.addEventListener('', this.e.videoPause)
    this.playSVG.addEventListener('click', this.e.videoPlay)

    this.initEventControl()

  }

  _videoPlay () {
    this.config._mediaElement.play()
  }

  _videoPause () {
    this.config._mediaElement.pause()
  }

  // 模仿双击事件
  _dblckick2pause () {
    if (this._date && new Date().getTime() - this._date <= 300) {
      this.e.videoPause()
    }
    this._date = new Date().getTime()
  }

  initEventControl () {

    this.config._emitter.on('pause', () => {
      this.playSVG.removeAttribute('hidden')
    })

    this.config._emitter.on('play', () => {
      this.playSVG.setAttribute('hidden', true)
      this.loadingSVG.setAttribute('hidden', true)
    })

    this.config._emitter.on('playing', () => {
      this.playSVG.setAttribute('hidden', true)
      this.loadingSVG.setAttribute('hidden', true)
    })

    this.config._emitter.on('abort', () => {
      this.loadingSVG.setAttribute('hidden', true)
    })

    this.config._emitter.on('error', () => {
      this.loadingSVG.setAttribute('hidden', true)
    })

    this.config._emitter.on('stalled', () => {
      this.loadingSVG.setAttribute('hidden', true)
    })

    this.config._emitter.on('waiting', () => {
      this.loadingSVG.removeAttribute('hidden')
    })



  }
}