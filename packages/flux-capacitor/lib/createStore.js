'use strict'

const combineChangesets = require('./database/combineChangesets')

/**
 * Creates a store that manages the event log as well as the reduced tables.<br/>
 * Never mutate the database's tables manually. Always call `.dispatch()` on
 * this store instead.
 *
 * @param {Function} reducer      `(collection: Collection, event: Event) => Changeset`
 * @param {Database} database     As returned by `connectTo` (`flux-capacitor-sequelize` package)
 * @param {Function} [enhancer]   Used to supply middleware(s). Signature:
 *                                `(createStore: Function) => (reducer: Function, database: Database) => Store`
 * @return {Store}                Store instance.
 */
function createStore (reducer, database, enhancer) {
  if (typeof database === 'function' && typeof enhancer === 'undefined') {
    enhancer = database
    database = undefined
  }

  if (enhancer) {
    if (typeof enhancer !== 'function') {
      throw new Error(`Expected enhancer to be a function, but got: ${typeof enhancer}`)
    }

    return enhancer(createStore)(reducer, database)
  }

  if (typeof reducer !== 'function') {
    throw new Error(`Expected reducer to be a function, but got: ${typeof reducer}`)
  }

  if (!database) {
    throw new Error(`Expected a database to be used by the store.`)
  }

  return _createStore(reducer, database)
}

module.exports = createStore

/**
 * @param {Function} reducer
 * @param {Database} database
 * @return {Store}
 * @private
 */
function _createStore (reducer, database) {
  let currentListeners = []

  /**
   * Dispatch an event or an array of events. In case you dispatch an event array
   * all events will be reduced using a shared transaction. If one fails, none
   * of the events will be applied/persisted.
   *
   * @param {Event|Array<Event>} event
   * @return {Promise<Array<Event>>}
   * @alias Store.dispatch
   */
  function dispatch (event) {
    if (!Array.isArray(event) && typeof event !== 'object') {
      throw new Error(`Expected event to be an object or array of objects, but got: ${typeof event}`)
    }

    const events = Array.isArray(event) ? event : [ event ]

    events.forEach((eventIt) => {
      if (!eventIt.type || typeof eventIt.type !== 'string') {
        console.error(`Expected event to have a type:`, eventIt)
        throw new Error(`Expected event to have a type.`)
      }
    })

    return _dispatch(reducer, database, events)
      .then((events) => {
        triggerListeners(currentListeners, events)
        return events
      })
  }

  /**
   * Return the `Database` instance used.
   *
   * @return {Database}
   * @alias Store.getDatabase
   */
  function getDatabase () {
    return database
  }

  /**
   * Subscribe to store, so your listener gets called whenever events have been dispatched.
   * Passing an array of events to the listener, since you can dispatch an array of events
   * (instead of a single one) and they will share the same database transaction.
   *
   * @param {Function} listener     `(events: Array<Event>) => void`
   * @return {Function} unsubscribe `() => void`
   * @alias Store.subscribe
   */
  function subscribe (listener) {
    if (typeof listener !== 'function') {
      throw new Error(`Expected listener to be a function, but got: ${typeof listener}`)
    }

    let isSubscribed = true
    currentListeners.push(listener)

    return function unsubscribe () {
      if (isSubscribed) {
        isSubscribed = false
        const index = currentListeners.indexOf(listener)
        currentListeners.splice(index, 1)
      }
    }
  }

  /**
   * @typedef {Object} Store
   * @property {Function} dispatch
   * @property {Function} getDatabase
   * @property {Function} subscribe
   */
  return {
    dispatch, getDatabase, subscribe
  }
}

/**
 * @param {Function} reducer
 * @param {Database} database
 * @param {Array<Event>} inputEvents
 * @return {Promise<Array<Event>>}
 * @private
 */
function _dispatch (reducer, database, inputEvents) {
  const events = inputEvents.map((inputEvent) => prepareForEventLog(inputEvent, database))

  const reducerDbChangesets = events
    .map((event) => reducer(database, event))
    .filter((changeset) => !!changeset)

  const aggregatedChangeset = combineChangesets(reducerDbChangesets)

  return database.transaction(
    (transaction) => transaction.perform(aggregatedChangeset)
  ).then(() => events)
}

function prepareForEventLog (event, database) {
  return Object.assign({}, event, {
    // setting `id` & `timestamp` here instead by DB query / default value, so we
    // can dispatch a complete event to the subscribers without an additional DB read
    id: event.id || database.createEventId(),
    timestamp: (new Date(Date.now())).toISOString()
  })
}

function triggerListeners (listeners, events) {
  listeners.forEach((listener) => {
    try {
      listener(events)
    } catch (error) {
      console.error(error.stack)
    }
  })
}
