const Koa = require('koa')
const request = require('supertest')
const should = require('should')
const koaJsonp = require('koa-safe-jsonp')
const koaViews = require('koa-views')

const responseHandler = require('.')

describe('koa-response-handler', () => {
  it('have a statusCode method', async () => {
    const app = new Koa()
      .use(responseHandler())
      .use(ctx => {
        should(ctx.statusCode).be.ok()
        should(ctx.statusCode).be.a.Function()
        should(ctx.response.statusCode).be.equal(ctx.statusCode)
      })

    await request(app.listen())
      .get('/')
      .expect(404)
  })

  it('have a sendStatus method', async () => {
    const app = new Koa()
      .use(responseHandler())
      .use(ctx => {
        should(ctx.sendStatus).be.ok()
        should(ctx.sendStatus).be.a.Function()
        should(ctx.response.sendStatus).be.equal(ctx.sendStatus)
      })

    await request(app.listen())
      .get('/')
      .expect(404)
  })

  it('have a send method', async () => {
    const app = new Koa()
      .use(responseHandler())
      .use(ctx => {
        should(ctx.send).be.ok()
        should(ctx.send).be.a.Function()
        should(ctx.response.send).be.equal(ctx.send)
      })

    await request(app.listen())
      .get('/')
      .expect(404)
  })

  it('have a json method', async () => {
    const app = new Koa()
      .use(responseHandler())
      .use(ctx => {
        should(ctx.json).be.ok()
        should(ctx.json).be.a.Function()
        should(ctx.response.json).be.equal(ctx.json)
      })

    await request(app.listen())
      .get('/')
      .expect(404)
  })

  it('should sendStatus method work', async () => {
    const app = new Koa()
      .use(responseHandler())
      .use(ctx => {
        ctx
          .statusCode(200)
          .sendStatus()
      })

    await request(app.listen())
      .get('/')
      .expect('Content-Type', /text/)
      .expect(/OK/)
      .expect(200)
  })

  it('should send method work', async () => {
    const app = new Koa()
      .use(responseHandler())
      .use(ctx => {
        ctx
          .statusCode(200)
          .send('hello world')
      })

    await request(app.listen())
      .get('/')
      .expect('Content-Type', /text/)
      .expect(/hello world/)
      .expect(200)
  })

  it('should json method work', async () => {
    const app = new Koa()
      .use(responseHandler())
      .use(ctx => {
        ctx
          .statusCode(200)
          .json({ msg: 'hello world' })
      })

    await request(app.listen())
      .get('/')
      .expect('Content-Type', /json/)
      .expect(/hello world/)
      .expect(200)
  })

  it('should throw when pass bad option --is-json', async () => {
    const app = new Koa()
      .use(responseHandler({
        isJSON: 'this is string not function'
      }))
      .use(ctx => {
        ctx
          .statusCode(200)
          .json({ msg: 'hello world' })
      })

    await request(app.listen())
      .get('/')
      .expect(500)
  })

  it('should throw when pass bad json --is-json', async () => {
    const app = new Koa()
      .use(responseHandler())
      .use(ctx => {
        ctx
          .statusCode(200)
          .json('{ x: 10, , y: 10 }')
      })

    await request(app.listen())
      .get('/')
      .expect(500)
  })

  it('koa-safe-jsonp: should find jsonp function', async () => {
    const app = new Koa()
    koaJsonp(app)

    app
      .use(responseHandler())
      .use(ctx => {
        should(ctx.jsonp).be.ok()
        should(ctx.jsonp).be.a.Function()
        should(ctx.response.jsonp).be.equal(ctx.jsonp)
        should(!ctx.jsonp.toString().includes('defaultNotImplMethods')).be.equal(true)
      })

    await request(app.listen()).get('/')
  })

  it('koa-safe-jsonp: should throw when do not find the jsonp function', async () => {
    const app = new Koa()
      .use(responseHandler())
      .use(ctx => { should.throws(() => { ctx.render() }) })

    await request(app.listen()).get('/')
  })

  it('koa-views: should find render function', async () => {
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

    await request(app.listen()).get('/')
  })

  it('koa-views: should throw when do not find the render function', async () => {
    const app = new Koa()
      .use(responseHandler())
      .use(ctx => { should.throws(() => { ctx.render() }) })

    await request(app.listen()).get('/')
  })
})
