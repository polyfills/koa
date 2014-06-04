
var koa = require('koa')
var assert = require('assert')
var request = require('supertest')

var polyfills = require('..')

var safari7 = 'User-Agent Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.76.4 (KHTML, like Gecko) Version/7.0.4 Safari/537.76.4'

describe('Koa Polyfills', function () {
  it('GET /polyfill.js', function (done) {
    var app = koa()
    app.use(polyfills())

    request(app.listen())
    .get('/polyfill.js')
    .set('User-Agent', safari7)
    .expect('Content-Type', 'application/javascript; charset=utf-8')
    .expect('Content-Encoding', 'gzip')
    .expect('Vary', 'Accept-Encoding, User-Agent')
    .expect(200, function (err, res) {
      if (err) return done(err)

      new Function(res.text)
      done()
    })
  })
})
