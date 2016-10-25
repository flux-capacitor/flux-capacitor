import test from 'ava'
import request from 'request-promise'
import sinon from 'sinon'
import {
  bootstrap, createExpressApp, createDispatcher, createReadRoute, /* createWebSocket, */ use
} from '../../../express'

const commands = {
  addUser: (payload) => ({ type: 'addUser', ...payload })
}

test(`bootstrapping a server from scratch`, async (t) => {
  const server = await bootstrapServer(mockStore())

  t.is(server.listening, true)
  server.close()
})

test(`dispatching 'addUser' works`, async (t) => {
  const server = await bootstrapServer(mockStore())
  const { port } = server.address()

  const events = await post(`http://localhost:${port}/dispatch/addUser`, { name: 'Nancy Newuser' })
  t.deepEqual(events, [
    { type: 'addUser', name: 'Nancy Newuser' }
  ])

  server.close()
})

test(`dispatching 'xyUser' fails`, async (t) => {
  const server = await bootstrapServer(mockStore())
  const { port } = server.address()

  await t.throws(post(`http://localhost:${port}/dispatch/xyUser`, {}), /Unknown command: xyUser/)

  server.close()
})

test(`reading events works`, async (t) => {
  const server = await bootstrapServer(mockStore())
  const { port } = server.address()

  const events = await request(`http://localhost:${port}/events`)
  t.deepEqual(events, JSON.stringify([
    { id: '123', type: 'mockEvent', foo: 'bar' }
  ]))

  server.close()
})

test(`reading a single event works`, async (t) => {
  const server = await bootstrapServer(mockStore())
  const { port } = server.address()

  const events = await request(`http://localhost:${port}/events/123`)
  t.deepEqual(events, JSON.stringify(
    { id: '123', type: 'mockEvent', foo: 'bar' }
  ))

  server.close()
})

function mockStore () {
  const store = {
    dispatch (events) {
      events = Array.isArray(events) ? events : [ events ]
      return Promise.resolve(events)
    },
    getDatabase () {
      return mockDatabase()
    },
    subscribe () {}
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

function bootstrapServer (store) {
  return bootstrap([
    // ({ app, routes, store }) => Promise.resolve({ app, routes, store }),
    use.app(createExpressApp()),
    use.store(store),
    use.route('/dispatch/:commandName', createDispatcher(commands)/* , (req) => authorize.allow() */),
    use.route('/events/:id?', createReadRoute('events', { sortBy: 'timestamp', sortOrder: 'DESC' })),
    use.route('/users/:id?', createReadRoute('users'))
//    use.route('/:collectionName', createRetrievalRoutes([ 'events', 'users' ])/* , (req) => authorize.allow() */),
//    use.route('/websocket', createWebSocket({
//      /* authorize: (message, websocket) => authorize.allow(), */
//    }))
  ]).listen()
}

function post (uri, body) {
  return request({
    uri, body, method: 'POST', json: true
  })
}
