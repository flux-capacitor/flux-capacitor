import test from 'ava'
import { timeout } from 'promise-timeout'
import request from 'request-promise'
import sinon from 'sinon'
import WebSocket from 'ws'
import authorize from '../../authorize'
import {
  bootstrap, createExpressApp, createDispatcher, createReadRoute, createWebSocket, use
} from '../../express'

const commands = {
  addUser: (payload) => ({ type: 'addUser', ...payload })
}

test(`bootstrapping a server from scratch`, async (t) => {
  const server = await bootstrap([
    use.app(createExpressApp()),
    use.store(mockStore())
  ]).listen()

  server.close()
})

test(`dispatching 'addUser' works`, async (t) => {
  const server = await bootstrap([
    use.app(createExpressApp()),
    use.store(mockStore()),
    use.route('/dispatch/:commandName', createDispatcher(commands))
  ]).listen()

  const { port } = server.address()
  const events = await post(`http://localhost:${port}/dispatch/addUser`, { name: 'Nancy Newuser' })

  t.deepEqual(events, [
    { type: 'addUser', name: 'Nancy Newuser' }
  ])

  server.close()
})

test(`dispatching 'xyUser' fails`, async (t) => {
  const server = await bootstrap([
    use.app(createExpressApp()),
    use.store(mockStore()),
    use.route('/dispatch/:commandName', createDispatcher(commands))
  ]).listen()

  const { port } = server.address()
  await t.throws(post(`http://localhost:${port}/dispatch/xyUser`, {}), /Unknown command: xyUser/)

  server.close()
})

test(`dispatching a restricted command fails`, async (t) => {
  const authorizer = (req) => req.params.command === 'restricted' ? authorize.deny('Nope!') : authorize.allow()
  const server = await bootstrap([
    use.app(createExpressApp()),
    use.store(mockStore()),
    use.route('/dispatch/:command', createDispatcher(commands), authorizer)
  ]).listen()

  const { port } = server.address()
  await t.throws(post(`http://localhost:${port}/dispatch/restricted`, {}), /Nope!/)

  server.close()
})

test(`reading events works`, async (t) => {
  const server = await bootstrap([
    use.app(createExpressApp()),
    use.store(mockStore()),
    use.route('/events/:id?', createReadRoute('events', { sortBy: 'timestamp', sortOrder: 'DESC' }))
  ]).listen()

  const { port } = server.address()
  const events = await request(`http://localhost:${port}/events`)

  t.deepEqual(events, JSON.stringify([
    { id: '123', type: 'mockEvent', foo: 'bar' }
  ]))

  server.close()
})

test(`reading a single event works`, async (t) => {
  const server = await bootstrap([
    use.app(createExpressApp()),
    use.store(mockStore()),
    use.route('/events/:id?', createReadRoute('events', { sortBy: 'timestamp', sortOrder: 'DESC' }))
  ]).listen()

  const { port } = server.address()
  const events = await request(`http://localhost:${port}/events/123`)

  t.deepEqual(events, JSON.stringify(
    { id: '123', type: 'mockEvent', foo: 'bar' }
  ))

  server.close()
})

test(`websocket propagates dispatched events`, async (t) => {
  t.plan(3)

  const store = mockStore()
  const authorizer = sinon.spy(
    (event) => event.type === 'restrictedEvent' ? authorize.deny() : authorize.allow()
  )

  const server = await bootstrap([
    use.app(createExpressApp()),
    use.store(store),
    use.route('/websocket', createWebSocket(authorizer))
  ]).listen()

  const { port } = server.address()
  const ws = new WebSocket(`ws://localhost:${port}/websocket`)

  await new Promise((resolve) =>
    ws.on('open', () => resolve(t.pass())
  ))

  const recvPromise = new Promise((resolve) => {
    ws.on('message', (data) => {
      t.deepEqual(JSON.parse(data), [
        {
          type: 'someEvent',
          payload: { foo: 'bar' }
        }
      ])
      resolve()
    })
  })

  store.dispatch([
    {
      type: 'restrictedEvent',
      payload: { secret: 'secret' }
    }, {
      type: 'someEvent',
      payload: { foo: 'bar' }
    }
  ])

  await timeout(recvPromise, 1000)
  t.is(authorizer.callCount, 2)

  server.close()
})

function mockStore () {
  const listeners = []
  const store = {
    dispatch (events) {
      events = Array.isArray(events) ? events : [ events ]
      listeners.forEach((listener) => listener(events))
      return Promise.resolve(events)
    },
    getDatabase () {
      return mockDatabase()
    },
    subscribe (listener) {
      listeners.push(listener)
      return () => {}
    }
  }

  sinon.spy(store, 'dispatch')
  sinon.spy(store, 'subscribe')

  return store
}

function mockDatabase () {
  const events = mockCollection('events', [
    { id: '123', type: 'mockEvent', foo: 'bar' }
  ])
  const users = mockCollection('users', [
    { id: '234', name: 'John Doe' }
  ])

  return {
    collections: {
      events, users
    }
  }
}

function mockCollection (name, rows) {
  const fields = {}
  rows.forEach(
    (row) => Object.keys(row).forEach(
      (fieldName) => { fields[ fieldName ] = fields[ fieldName ] || {} }
    )
  )

  const findAll = sinon.spy(async () => rows)
  const findById = sinon.spy(async (id) => rows.find((row) => row.id === id))

  return { name, fields, findAll, findById }
}

function post (uri, body) {
  return request({
    uri, body, method: 'POST', json: true
  })
}
