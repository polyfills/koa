
var push = require('koa-spdy-push')()

module.exports = function (options) {
  options = options || {}

  var polyfill = require('polyfills')(options)

  var path = options.path || '/polyfill.js'
  if (path[0] !== '/') path = '/' + path

  // note: i want to tell proxies to not cache this,
  // not sure how to do that
  var maxAge = options.maxAge || '2 weeks'
  if (typeof maxAge === 'string') maxAge = require('ms')(maxAge)
  maxAge = Math.round(maxAge / 1000)
  var cacheControl = 'public, max-age=' + maxAge

  var minify = options.minify

  function Polyfills(context) {
    this.context = context
  }

  Polyfills.prototype.push = function* () {
    var context = this.context
    var js = yield* polyfill(context.req.headers['user-agent'])
      .build(minify, true)

    push(context, {
      path: path,
      headers: {
        'cache-control': cacheControl,
        'content-type': 'application/javascript; charset=utf-8',
        'content-encoding': 'gzip',
        'content-length': js.length,
        'vary': 'User-Agent',
      },
      body: js
    })
  }

  return function* polyfills(next) {
    this.polyfills = new Polyfills(this)

    if (this.request.path !== path) return yield* next

    var gzip = this.request.acceptsEncodings('gzip', 'identity') === 'gzip'
    var js = yield* polyfill(this.req.headers['user-agent'])
      .build(minify, gzip)

    this.response.set('Cache-Control', cacheControl)
    this.response.set('Content-Encoding', gzip ? 'gzip' : 'identity')
    this.response.vary('Accept-Encoding')
    this.response.vary('User-Agent')
    this.response.type = 'application/javascript; charset=utf-8'
    this.response.body = js
  }
}
