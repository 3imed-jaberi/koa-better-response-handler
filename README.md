# koa-better-response-handler
---

[![Build Status][travis-img]][travis-url]
[![Coverage Status][coverage-img]][coverage-url]
[![NPM version][npm-badge]][npm-url]
[![License][license-badge]][license-url]
![Code Size][code-size-badge]

<!-- ***************** -->

[travis-img]: https://travis-ci.org/3imed-jaberi/koa-better-response-handler.svg?branch=master
[travis-url]: https://travis-ci.org/3imed-jaberi/koa-better-response-handler
[coverage-img]: https://coveralls.io/repos/github/3imed-jaberi/koa-better-response-handler/badge.svg?branch=master
[coverage-url]: https://coveralls.io/github/3imed-jaberi/koa-better-response-handler?branch=master
[npm-badge]: https://img.shields.io/npm/v/koa-better-response-handler.svg?style=flat
[npm-url]: https://www.npmjs.com/package/koa-better-response-handler
[license-badge]: https://img.shields.io/badge/license-MIT-green.svg?style=flat-square
[license-url]: https://github.com/3imed-jaberi/koa-better-response-handler/blob/master/LICENSE
[code-size-badge]: https://img.shields.io/github/languages/code-size/3imed-jaberi/koa-better-response-handler

[koa-is-json]: https://github.com/koajs/is-json
[Express.js]: https://github.com/expressjs/express
[koa-views]: https://github.com/queckezz/koa-views
[jsonp-opts]: https://github.com/node-modules/jsonp-body#jsonpobj-callback-options

<!-- ***************** -->

Express.js response handler interface for Koa.js (identical).

* 🦄 Inspired from [Express.js].
* 🔥 Amiable and lightweight handler.
* 💅🏻 Express-style handler (`.send()`, `.json()`, `.render()`, `.jsonp()`, `.statusCode()` etc.)
* 🎈 Support for `.render()` methods through [koa-views] middelware.
* ⚖️ Tiny Bundle.


## `Installation`

```bash
# koa-is-json: need when you use `.json()` to check passed data is json.
# jsonp-body: need when you use `.jsonp()` to handle jsonp.

# npm
$ npm install koa-better-response-handler koa-is-json jsonp-body
# yarn
$ yarn add koa-better-response-handler koa-is-json jsonp-body
```


## `Usage`

This is a practical example of how to use.

```javascript
const Koa = require('koa')
const responseHandler = require('koa-better-response-handler')
const app = new Koa()

app.use(responseHandler())
// ==> ctx.statusCode(200).send('Hello World')
// ==> ctx.statusCode(200).json({ msg: 'Hello World' })
// ==> ctx.statusCode(200).sendStatus() // OK
```

### `OPTIONS`

By default `koa-better-response-handler` use [koa-is-json] to validate 
the passed data but you can ignore the installation of `koa-is-json` 
and use your custom json checker function by pass and object like this: 

```javascript
app.use(responseHandler({
  isJSON: () => { /* custom json checker */ }
}))
```

You can also pass [options][jsonp-opts] object for jsonp;

```javascript
app.use(responseHandler({
  isJSON: () => {},
  jsonpOpts: {
      callback: '_callback', // default is 'callback'
      limit: 50 // max callback name string length, default is 512
  }
}))
```


## `Note`

Make sure to use [koa-views] middelware before use this.

```javascript
const Koa = require('koa')
// support boom methods.
const boom = require('koa-better-boom')
// support render method.
const views = require('koa-views')
// support express handler style.
const responseHandler = require('koa-better-response-handler')

const app = new Koa()

app
  .use(boom()) // --> ctx.boom.badRequest().
  .use(views()) // --> ctx.render().
  .use(responseHandler())
```


#### License
---

[MIT](LICENSE) &copy;	[Imed Jaberi](https://github.com/3imed-jaberi)
