const Koa = require('koa')
const request = require('supertest')
const should = require('should')
const koaViews = require('koa-views')
const koaQueryString = require('koa-qs')

const responseHandler = require('.')

describe('koa-response-handler', () => {
  it('have a statusCode method', done => {
    const app = new Koa()
      .use(responseHandler())
      .use(ctx => {
        should(ctx.statusCode).be.ok()
        should(ctx.statusCode).be.a.Function()
        should(ctx.response.statusCode).be.equal(ctx.statusCode)
      })

    request(app.listen())
      .get('/')
      .expect(404, done)
  })

  it('have a sendStatus method', done => {
    const app = new Koa()
      .use(responseHandler())
      .use(ctx => {
        should(ctx.sendStatus).be.ok()
        should(ctx.sendStatus).be.a.Function()
        should(ctx.response.sendStatus).be.equal(ctx.sendStatus)
      })

    request(app.listen())
      .get('/')
      .expect(404, done)
  })

  it('have a send method', done => {
    const app = new Koa()
      .use(responseHandler())
      .use(ctx => {
        should(ctx.send).be.ok()
        should(ctx.send).be.a.Function()
        should(ctx.response.send).be.equal(ctx.send)
      })

    request(app.listen())
      .get('/')
      .expect(404, done)
  })

  it('have a json method', done => {
    const app = new Koa()
      .use(responseHandler())
      .use(ctx => {
        should(ctx.json).be.ok()
        should(ctx.json).be.a.Function()
        should(ctx.response.json).be.equal(ctx.json)
      })

    request(app.listen())
      .get('/')
      .expect(404, done)
  })

  it('should sendStatus method work', done => {
    const app = new Koa()
      .use(responseHandler())
      .use(ctx => {
        ctx
          .statusCode(200)
          .sendStatus()
      })

    request(app.listen())
      .get('/')
      .expect('Content-Type', /text/)
      .expect(/OK/)
      .expect(200, done)
  })

  it('should send method work', done => {
    const app = new Koa()
      .use(responseHandler())
      .use(ctx => {
        ctx
          .statusCode(200)
          .send('hello world')
      })

    request(app.listen())
      .get('/')
      .expect('Content-Type', /text/)
      .expect(/hello world/)
      .expect(200, done)
  })

  it('should json method work', done => {
    const app = new Koa()
      .use(responseHandler())
      .use(ctx => {
        ctx
          .statusCode(200)
          .json({ msg: 'hello world' })
      })

    request(app.listen())
      .get('/')
      .expect('Content-Type', /json/)
      .expect(/hello world/)
      .expect(200, done)
  })

  it('should throw when pass bad option --is-json', done => {
    const app = new Koa()
      .use(responseHandler({
        isJSON: 'this is string not function'
      }))
      .use(ctx => {
        ctx
          .statusCode(200)
          .json({ msg: 'hello world' })
      })

    request(app.listen())
      .get('/')
      .expect(500, done)
  })

  it('should throw when pass bad json --is-json', done => {
    const app = new Koa()
      .use(responseHandler())
      .use(ctx => {
        ctx
          .statusCode(200)
          .json('{ x: 10, , y: 10 }')
      })

    request(app.listen())
      .get('/')
      .expect(500, done)
  })

  it('koa-views: should find render function', (done) => {
    const app = new Koa()
      .use(koaViews())
      .use(responseHandler())
      .use(ctx => {
        should(ctx.render).be.ok()
        should(ctx.render).be.a.Function()
        should(ctx.response.render).be.equal(ctx.render)
        // should use `koa-views`.
        should(!ctx.render.toString().includes('defaultNotImplMethods')).be.equal(true)
      })

    request(app.listen()).get('/').end(done)
  })

  it('koa-views: should throw when do not finde the render function', (done) => {
    const app = new Koa()
      .use(responseHandler())
      .use(ctx => { should.throws(() => { ctx.render() }) })

    request(app.listen()).get('/').end(done)
  })

  // test code from:
  // https://github.com/koajs/koa-safe-jsonp/blob/master/test/index.test.js
  // with some modification
  describe('support jsonp', function () {
    it('should send normal response when callback missing', function (done) {
      const app = new Koa()
        .use(responseHandler())
        .use(function (ctx) {
          ctx.jsonp({ foo: 'bar' })
        })

      request(app.listen())
        .get('/foo.json?foo=fn')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect('{"foo":"bar"}')
        .expect(200, done)
    })

    it('should send normal response when callback is empty string', function (done) {
      const app = new Koa()
        .use(responseHandler())
        .use(function (ctx) {
          ctx.jsonp({ foo: 'bar' })
        })

      request(app.listen())
        .get('/foo.json?foo=fn&callback=')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect('{"foo":"bar"}')
        .expect(200, done)
    })

    it('should send jsonp response with default callback', function (done) {
      const app = new Koa()
        .use(responseHandler())
        .use(function (ctx) {
          ctx.jsonp({ foo: 'bar' })
        })

      request(app.listen())
        .get('/foo.json?callback=fn')
        .expect('Content-Type', 'application/javascript; charset=utf-8')
        .expect('X-Content-Type-Options', 'nosniff')
        .expect('/**/ typeof fn === \'function\' && fn({"foo":"bar"});')
        .expect(200, done)
    })

    it('should send jsonp response with array callback', function (done) {
      const app = new Koa()
      koaQueryString(app)
      app
        .use(responseHandler())
        .use(function (ctx) {
          ctx.jsonp({ foo: 'bar' })
        })

      request(app.listen())
        .get('/foo.json?callback=fn&callback=cb')
        .expect('Content-Type', 'application/javascript; charset=utf-8')
        .expect('X-Content-Type-Options', 'nosniff')
        .expect('/**/ typeof fn === \'function\' && fn({"foo":"bar"});')
        .expect(200, done)
    })

    it('should send number response', function (done) {
      const app = new Koa()
        .use(responseHandler())
        .use(function (ctx) {
          ctx.jsonp(1984)
        })

      request(app.listen())
        .get('/foo.json?callback=fn')
        .expect('Content-Type', 'application/javascript; charset=utf-8')
        .expect('X-Content-Type-Options', 'nosniff')
        .expect("/**/ typeof fn === 'function' && fn(1984);")
        .expect(200, done)
    })

    it('should send string response', function (done) {
      const app = new Koa()
        .use(responseHandler())
        .use(function (ctx) {
          ctx.jsonp('1984')
        })

      request(app.listen())
        .get('/foo.json?callback=fn')
        .expect('Content-Type', 'application/javascript; charset=utf-8')
        .expect('X-Content-Type-Options', 'nosniff')
        .expect('/**/ typeof fn === \'function\' && fn("1984");')
        .expect(200, done)
    })

    it('should send jsonp response with custom callback', function (done) {
      const app = new Koa()
        .use(responseHandler({
          jsonp: { callback: '_callback' }
        }))
        .use(function (ctx) {
          ctx.jsonp({ foo: 'bar' })
        })

      request(app.listen())
        .get('/foo.json?_callback=$jsonp_callback')
        .expect('Content-Type', 'application/javascript; charset=utf-8')
        .expect('X-Content-Type-Options', 'nosniff')
        .expect(
          '/**/ typeof $jsonp_callback === \'function\' && $jsonp_callback({"foo":"bar"});'
        )
        .expect(200, done)
    })

    it('should limit callback name length to 10', function (done) {
      const app = new Koa()
        .use(responseHandler({
          jsonp: { callback: '_callback', limit: 10 }
        }))
        .use(function (ctx) {
          ctx.jsonp({ foo: 'bar' })
        })

      request(app.listen())
        .get(
          '/foo.json?_callback=$123456789jsonp_callbackjsonp_callbackjsonp_callback'
        )
        .expect('Content-Type', 'application/javascript; charset=utf-8')
        .expect('X-Content-Type-Options', 'nosniff')
        .expect(
          '/**/ typeof $123456789 === \'function\' && $123456789({"foo":"bar"});'
        )
        .expect(200, done)
    })

    it('should dont limit when callback name length < limit options', function (done) {
      const app = new Koa()
        .use(responseHandler({
          jsonp: { callback: '_callback', limit: 10 }
        }))
        .use(function (ctx) {
          ctx.jsonp({ foo: 'bar' })
        })

      request(app.listen())
        .get('/foo.json?_callback=$123')
        .expect('Content-Type', 'application/javascript; charset=utf-8')
        .expect('X-Content-Type-Options', 'nosniff')
        .expect('/**/ typeof $123 === \'function\' && $123({"foo":"bar"});')
        .expect(200, done)
    })
  })
})
