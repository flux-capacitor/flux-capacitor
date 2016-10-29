const assert = require('assert')
const expressWS = require('express-ws')
const authorize = require('../authorize')

module.exports = createWebSocket

/**
 * @param {Function} [authorizer] (Event, WebSocket) => Authorize.*
 * @return {Function}             (Express.Route, bootstrapped: Object) => Express.Route
 */
function createWebSocket (authorizer) {
  authorizer = authorizer || (() => authorize.allow())

  /**
   * @param {Express.Route} route       Path must contain a `:collection` or `:collectionName` route param.
   * @param {Object} bootstrapped       Internal state of `bootstrap()`.
   * @param {App} bootstrapped.app      Express app.
   * @param {Store} bootstrapped.store  Flux capacitor store.
   * @param {string} path               Path to `route`.
   * @return {Express.Route}
   */
  return (route, { app, store }, path) => {
    assert(app, `createWebSocket(): No app set yet. Use 'use.app()' before.`)
    assert(store, `createWebSocket(): No store set yet. Use 'use.store()' before.`)

    expressWS(app)

    const socketHandler = createSocketHandler(store, authorizer)
    app.ws(path, socketHandler)

    console.log(`Web socket available on path: ${path}`)
    return route
  }
}

/**
 * @param {Store} store   Flux capacitor store.
 * @param {Function}      authorizer (Event, WebSocket) => Authorize.*
 * @return {Function}     (WebSocket) => void
 */
function createSocketHandler (store, authorizer) {
  /**
   * @param {WebSocket} socket
   * @return {void}
   */
  return function socketHandler (socket) {
    const isEventAuthorized = createEventAuthorizer(socket, authorizer)

    const unsubscribe = store.subscribe((events) => {
      const authorizedEvents = events.filter(isEventAuthorized)
      socket.send(JSON.stringify(authorizedEvents))
    })

    socket.on('close', () => unsubscribe())
  }
}

/**
 * Take the authorizer function and the websocket and return a function that
 * decides whether an event may be send to the client by using the authorizer
 * function.
 *
 * @param {WebSocket} socket
 * @param {Function} authorizer (Event, WebSocket) => Authorize.*
 * @return {Function}           (Event) => boolean
 */
function createEventAuthorizer (socket, authorizer) {
  return (event) => authorize.isAuthorized(() => authorizer(event, socket))
}
