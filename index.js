/*!
 * koa-better-response-handler
 *
 * Copyright(c) 2020 Imed Jaberi
 * MIT Licensed
 */

'use strict'

/**
 * Module dependencies.
 */
const _isJSON = require('koa-is-json')

/**
 * Expose `responseHandler()`.
 */

module.exports = responseHandler

/**
 * Same response methods like `express`
 *
 * @api public
 */
function responseHandler (options = {}) {
  // customize you json validation function
  const isJSON = options.isJSON || _isJSON

  return (ctx, next) => {
    // init an local response obejct
    const response = Object.create(ctx.response)

    // all header handlers like append, set,
    // get, remove are available by default

    // status handler
    response.statusCode = function (code) {
      this.status = code
      return this
    }

    // sendStatus handler
    response.sendStatus = function () {
      this.body = this.message
    }

    // send handler
    // handled directly with koa
    response.send = function (data) {
      this.body = data
    }

    // json handler
    response.json = function (data) {
      if (typeof isJSON !== 'function') {
        this.throw(500, '`isJSON` option should be a function')
      }

      if (!isJSON(data)) {
        this.throw(500, 'please use a valid json response')
      }

      this.body = data
    }

    // note
    // use `koa-safe-jsonp` for `jsonp` method
    // use `koa-views` for the `render` method

    // example: ctx.response.statusCode(200).send('Hello World !')
    ctx.response = Object.assign(ctx.response, response)
    // example: ctx.statusCode(200).send('Hello World !')
    ctx = Object.assign(ctx, ctx.response)

    return next()
  }
}
