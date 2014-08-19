
# Koa Polyfills

[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![Dependency Status][david-image]][david-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]
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

[npm-image]: https://img.shields.io/npm/v/koa-polyfills.svg?style=flat-square
[npm-url]: https://npmjs.org/package/koa-polyfills
[github-tag]: http://img.shields.io/github/tag/polyfills/koa.svg?style=flat-square
[github-url]: https://github.com/polyfills/koa/tags
[travis-image]: https://img.shields.io/travis/polyfills/koa.svg?style=flat-square
[travis-url]: https://travis-ci.org/polyfills/koa
[coveralls-image]: https://img.shields.io/coveralls/polyfills/koa.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/polyfills/koa?branch=master
[david-image]: http://img.shields.io/david/polyfills/koa.svg?style=flat-square
[david-url]: https://david-dm.org/polyfills/koa
[license-image]: http://img.shields.io/npm/l/koa-polyfills.svg?style=flat-square
[license-url]: LICENSE
[downloads-image]: http://img.shields.io/npm/dm/koa-polyfills.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/koa-polyfills
[gittip-image]: https://img.shields.io/gittip/jonathanong.svg?style=flat-square
[gittip-url]: https://www.gittip.com/jonathanong/
