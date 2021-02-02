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
const _jsonBody = require('jsonp-body')

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

  // jsonp options.
  const jsonpOpts = options.jsonp || {}
  const callback = jsonpOpts.callback || 'callback'

  // default func used when we don't find requested method in ctx.
  function defaultNotImplMethods (method, mwModule) {
    throw new Error(
      'Can not find the ' + method + ' method inside the context.' +
      '\n' + 'Make sure that you load the `' + mwModule + '` first.'
    )
  }

  return (ctx, next) => {
    // integrate with koa-views.
    const render = {
      render: !ctx.render
        ? () => defaultNotImplMethods('render', 'koa-views')
        : ctx.render
    }

    // init an local response obejct.
    const response = Object.create(ctx.response)

    // all header handlers like append, set,
    // get, remove are available by default.

    // status handler.
    response.statusCode = function (code) {
      this.status = code
      return this
    }

    // sendStatus handler.
    response.sendStatus = function () {
      this.body = this.message
    }

    // send handler.
    response.send = function (data) {
      this.body = data
    }

    // json handler.
    response.json = function (data) {
      // validate the isJSON method.
      if (typeof isJSON !== 'function') {
        throw new Error('`isJSON` option should be a function.')
      }

      if (!isJSON(data)) {
        this.throw(500, 'please use a valid json response.')
      }

      this.body = data
    }

    // jsonp handler.
    response.jsonp = function (data) {
      const jsonpFunc = this.query[callback]

      if (!jsonpFunc) {
        this.body = data
        return
      }

      this.set('X-Content-Type-Options', 'nosniff')
      this.type = 'js'
      this.body = _jsonBody(data, jsonpFunc, jsonpOpts)
    }

    // append all methods to ctx and ctx.response.
    ctx.response = Object.assign(ctx.response, response, render)
    ctx = Object.assign(ctx, ctx.response, render)

    return next()
  }
}
