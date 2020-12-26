const Koa = require('koa')
const request = require('supertest')
const should = require('should')

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
})
