import test, { after, before } from 'ava'
import sinon from 'sinon'
import createStore from '../createStore'

let clock

before(() => {
  const fakeDate = new Date('2016-10-01T12:00:00.000Z')
  clock = sinon.useFakeTimers(fakeDate.getTime())
})

after(() => {
  clock.restore()
})

test('createStore() returns a valid store', (t) => {
  const reducer = sinon.spy(() => null)
  const database = createFakeDatabase()
  const store = createStore(reducer, database)

  t.truthy(store)
  t.is(typeof store, 'object')
  t.is(typeof store.dispatch, 'function')
  t.is(typeof store.getDatabase, 'function')
  t.is(typeof store.subscribe, 'function')

  t.is(store.getDatabase(), database)
})

test('store can dispatch single event', async (t) => {
  const reducer = sinon.spy(() => null)
  const database = createFakeDatabase()
  const store = createStore(reducer, database)

  t.is(reducer.callCount, 0)
  const events = await store.dispatch({
    type: 'TEST',
    payload: {
      foo: 'bar'
    }
  })

  t.is(reducer.callCount, 1)
  t.deepEqual(reducer.lastCall.args, [ database, events[0] ])
  t.deepEqual(events, [
    {
      type: 'TEST',
      id: 'some-id',
      timestamp: '2016-10-01T12:00:00.000Z',
      payload: {
        foo: 'bar'
      }
    }
  ])
})

test('store can dispatch multiple events at once', async (t) => {
  const reducer = sinon.spy(() => null)
  const database = createFakeDatabase()
  const store = createStore(reducer, database)

  t.is(reducer.callCount, 0)
  const events = await store.dispatch([
    {
      type: 'TEST',
      payload: {
        foo: 'bar'
      }
    }, {
      type: 'TEST2',
      meta: {}
    }
  ])

  t.is(reducer.callCount, 2)
  t.deepEqual(reducer.firstCall.args, [ database, events[0] ])
  t.deepEqual(reducer.secondCall.args, [ database, events[1] ])
  t.deepEqual(events, [
    {
      type: 'TEST',
      id: 'some-id',
      timestamp: '2016-10-01T12:00:00.000Z',
      payload: {
        foo: 'bar'
      }
    }, {
      type: 'TEST2',
      id: 'some-id',
      timestamp: '2016-10-01T12:00:00.000Z',
      meta: {}
    }
  ])
})

test.todo('store executes changesets returned by reducers')

test('store calls listeners', async (t) => {
  // dispatch two events at once, plus a single event for testing, unsubscribe, dispatch another
  const listener = sinon.spy(() => {})
  const reducer = sinon.spy(() => null)
  const database = createFakeDatabase()
  const store = createStore(reducer, database)

  const unsubscribe = store.subscribe(listener)
  t.is(typeof unsubscribe, 'function')

  t.is(listener.callCount, 0)
  const [ firstEvent ] = await store.dispatch({ type: 'TEST' })

  t.is(listener.callCount, 1)
  t.deepEqual(listener.firstCall.args, [ [ firstEvent ] ])

  const secondEvents = await store.dispatch([
    { type: 'TEST2' }, { type: 'TEST3' }
  ])

  t.is(listener.callCount, 2)
  t.deepEqual(listener.secondCall.args, [ secondEvents ])

  unsubscribe()

  await store.dispatch({ type: 'TEST4' })
  t.is(listener.callCount, 2)

  t.notThrows(() => unsubscribe())
})

function createFakeDatabase () {
  return {
    createEventId: sinon.spy(() => 'some-id'),
    transaction: sinon.spy(() => Promise.resolve())
  }
}
