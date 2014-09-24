
var spdy = require('spdy-push')

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

  function Polyfills(context) {
    this.context = context
  }

  Polyfills.prototype.push = function* () {
    var context = this.context
    var data = yield polyfill(context.req.headers['user-agent'])
    var headers = {
      'cache-control': cacheControl,
      'content-type': 'application/javascript; charset=utf-8',
      'etag': '"' + data.hash + '"',
      'last-modified': data.date.toUTCString(),
      'vary': 'User-Agent',
    }

    var ext
    if (minify) {
      if (data.length['.min.js'] < data['.min.js.gz']) {
        // gzipped is larger than the original o.O
        ext = '.min.js'
      } else {
        headers['content-encoding'] = 'gzip'
        ext = '.min.js.gz'
      }
    } else {
      if (data.length['.js'] < data['.js.gz']) {
        ext = '.js'
      } else {
        headers['content-encoding'] = 'gzip'
        ext = '.js.gz'
      }
    }

    var buf = yield polyfill.read(data.name, ext)
    headers['content-length'] = buf.length

    return spdy(context.res).push({
      path: path,
      headers: headers,
      body: buf
    })
  }

  return function* polyfills(next) {
    this.polyfills = new Polyfills(this)
    if (this.request.path !== path) return yield* next

    this.response.set('Cache-Control', cacheControl)
    this.response.vary('Accept-Encoding')
    this.response.vary('User-Agent')
    this.response.type = 'application/javascript; charset=utf-8'

    var data = yield polyfill(this.req.headers['user-agent'])

    this.response.etag = data.hash
    this.response.lastModified = data.date
    if (this.request.fresh) return this.response.status = 304

    var ext
    var gzip = this.request.acceptsEncodings('gzip', 'identity') === 'gzip'
    if (minify) {
      if (!gzip || data.length['.min.js'] < data['.min.js.gz']) {
        // gzipped is larger than the original o.O
        gzip = false
        ext = '.min.js'
      } else {
        ext = '.min.js.gz'
      }
    } else {
      if (!gzip || data.length['.js'] < data['.js.gz']) {
        gzip = false
        ext = '.js'
      } else {
        ext = '.js.gz'
      }
    }

    this.response.set('Content-Encoding', gzip ? 'gzip' : 'identity')
    this.response.body = yield polyfill.read(data.name, ext)
  }
}
