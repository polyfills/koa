
var Polyfills = require('push-polyfills')

var production = process.env.NODE_ENV === 'production'

module.exports = function (options) {
  options = options || {}

  var polyfill = require('polyfills')(options)

  var path = options.path || '/polyfill.js'
  if (path[0] !== '/') path = '/' + path

  // note: i want to tell proxies to not cache this,
  // not sure how to do that
  var maxAge = options.maxage || options.maxAge || '14 days'
  if (typeof maxAge === 'string') maxAge = require('ms')(maxAge)
  maxAge = Math.round(maxAge / 1000)
  var cacheControl = 'public, max-age=' + maxAge

  var minify = options.minify
  if (minify == null) minify = production

  return function* polyfills(next) {
    this.polyfills = new Polyfills(polyfill, this.req, this.res, {
      cacheControl: cacheControl,
      minify: minify,
    })

    if (this.request.path !== path) return yield* next

    this.response.set('Cache-Control', cacheControl)
    this.response.vary('Accept-Encoding')
    this.response.vary('User-Agent')
    this.response.type = 'js'

    var data = yield polyfill(this.req.headers['user-agent'])

    this.response.etag = data.hash
    if (this.request.fresh) return this.response.status = 304

    var info = polyfill.select(data, minify, this.request.acceptsEncodings('gzip', 'identity') === 'gzip')
    this.response.set('Content-Encoding', info[1] ? 'gzip' : 'identity')
    this.response.body = polyfill.stream(data.name, info[0])
  }
}
