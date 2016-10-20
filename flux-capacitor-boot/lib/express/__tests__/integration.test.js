import test from 'ava'
import request from 'request-promise'
import sinon from 'sinon'
import {
  bootstrap, createExpressApp, createDispatcher, /* createRetrievalRoutes, createWebSocket, */ use
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

function mockStore () {
  const store = {
    dispatch (events) {
      events = Array.isArray(events) ? events : [ events ]
      return Promise.resolve(events)
    },
    subscribe () {}
  }

  sinon.spy(store, 'dispatch')
  sinon.spy(store, 'subscribe')

  return store
}

function bootstrapServer (store) {
  return bootstrap([
    // ({ app, routes, store }) => Promise.resolve({ app, routes, store }),
    use.app(createExpressApp()),
    use.store(store),
    use.route('/dispatch/:commandName', createDispatcher(commands)/* , (req) => authorize.allow() */)
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
