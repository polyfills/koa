
var polyfills = require('polyfills')

var loaded = false

module.exports = function (options) {
  options = options || {}

  var polyfill = polyfills(options)

  var path = options.path || '/polyfill.js'
  if (path[0] !== '/') path = '/' + path

  // note: i want to tell proxies to not cache this,
  // not sure how to do that
  var maxAge = options.maxage || options.maxAge || '1 days'
  if (typeof maxAge === 'string') maxAge = require('ms')(maxAge)
  maxAge = Math.round(maxAge / 1000)
  var cacheControl = 'public, max-age=' + maxAge

  return function* _polyfills(next) {
    if (this.request.path !== path) return yield* next

    if (!loaded) {
      yield polyfills.load
      loaded = true
    }

    this.response.set('Cache-Control', cacheControl)
    this.response.vary('User-Agent')
    this.response.type = 'js'
    this.response.body = polyfill(this.req.headers['user-agent'])
  }
}
