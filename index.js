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
  // customize you json validation function.
  const isJSON = options.isJSON || _isJSON

  // default func used when we don't find requested method in ctx.
  function defaultNotImplMethods (method, mwModule) {
    throw new Error(
      'Can not find the ' + method + ' method inside the context. \n' +
      'Make sure that you load the `' + mwModule + '` module first.'
    )
  }

  return (ctx, next) => {
    const responseFactoryObject = {
      // all header handlers like append, set,
      // get, remove are available by default.

      // status handler.
      statusCode (code) {
        this.status = code
        return this
      },
      // sendStatus handler.
      sendStatus () {
        this.body = this.message
      },
      // send handler.
      send (data) {
        this.body = data
      },
      // json handler.
      json (data) {
        // validate the isJSON method.
        if (typeof isJSON !== 'function') throw new Error('`isJSON` option should be a function.')

        if (!isJSON(data)) this.throw(500, 'please use a valid json response.')

        this.body = data
      },
      // jsonp handler (integrate with koa-safe-jsonp)..
      jsonp: !ctx.render
        ? () => defaultNotImplMethods('jsonp', 'koa-safe-jsonp')
        : ctx.jsonp,
      // render handler (integrate with koa-views).
      render: !ctx.render
        ? () => defaultNotImplMethods('render', 'koa-views')
        : ctx.render
    }

    // append all response methods to ctx and ctx.response.
    Object.assign(ctx, Object.assign(ctx.response, responseFactoryObject))

    return next()
  }
}
