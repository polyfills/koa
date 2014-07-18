
# Koa Polyfills

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![Gittip][gittip-image]][gittip-url]

[Polyfills](https://github.com/polyfills/polyfills/) middleware for [koa](https://github.com/koajs/koa).

- Option to SPDY push dependencies
- Handles gzip compression
- Caches on the server

## Usage

```bash
npm install koa-polyfills
```

```js
app.use(require('koa-polyfills')())
```

## API

### app.use(polyfills([options]))

The `options` for the middleware, other than those passed directly to [polyfills](https://github.com/polyfills/polyfills/), are:

- `path` - the path for the polyfill, defaulting to `/polyfill.js`
- `maxAge` - the max age for the polyfill's cache control, defaulting to `2 weeks`

### yield this.polyfills.push()

Call this to SPDY Push the polyfills to the client to avoid an additional HTTP request.

[npm-image]: https://img.shields.io/npm/v/koa-polyfills.svg?style=flat
[npm-url]: https://npmjs.org/package/koa-polyfills
[travis-image]: https://img.shields.io/travis/polyfills/koa.svg?style=flat
[travis-url]: https://travis-ci.org/polyfills/koa
[coveralls-image]: https://img.shields.io/coveralls/polyfills/koa.svg?style=flat
[coveralls-url]: https://coveralls.io/r/polyfills/koa?branch=master
[gittip-image]: https://img.shields.io/gittip/jonathanong.svg?style=flat
[gittip-url]: https://www.gittip.com/jonathanong/
