export const getUrlInfo = function (ms = '') {
  let regexps = {
    mp4: /\.mp4/,
    flv: /\.flv/,
    hls: /\.m3u8/
  }

  let type = ''
  let keys = Object.keys(regexps)
  keys.map(item => {
    if (regexps[item].test(ms)) {
      type = item
    }
  })

  let lastIndex = ms.indexOf('?') || ms.length
  let clearUrl = ms.substring(0, lastIndex)

  let hash = ms.slice(lastIndex + 1).split('&')
  let params = {}
  hash.map(item => {
    let k = item.split('=')
    params[k[0]] = k[1]
  })

  if (!type) {
    throw new Error(`unable to support this type of video by mediaSource: ${ms}`)
  }

  return {
    type,
    clearUrl,
    params
  }
}