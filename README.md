
# Koa Polyfills

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
- `minify` - whether to serve the JS minified, defaulting to `process.env.NODE_ENV === 'production'`

### yield* this.polyfills.push()

Call this to SPDY Push the polyfills to the client to avoid an additional HTTP request.
