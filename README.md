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
[koa-safe-jsonp]: https://github.com/koajs/koa-safe-jsonp
[koa-views]: https://github.com/queckezz/koa-views

<!-- ***************** -->

Express.js response handler interface for Koa.js (identical).


## `Installation`

```bash
# npm
$ npm install koa-better-response-handler
# yarn
$ yarn add koa-better-response-handler
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

By default `koa-better-response-handler` use [koa-is-json] to validate the passed data but you can use your custom json checker function by pass and object like this: 

```javascript
app.use(responseHandler({
  isJSON: () => { /* custom json checker */ }
}))
```

## `Note`

This middelware provide only the missing methods. So, you can use `.jsonp()` by [koa-safe-jsonp] and `.render()` by [koa-views] with this middelware to get all interfaces.

#### License
---

[MIT](LICENSE) &copy;	[Imed Jaberi](https://github.com/3imed-jaberi)
