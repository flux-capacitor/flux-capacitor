const assert = require('assert')
const useAsyncHandler = require('./util/useAsyncHandler')

module.exports = createDispatcher

/**
 * @param {Object} commands                 { [commandName: string]: Function }
 * @param {Object} [options]
 * @param {Function} [options.createMeta]   (Request, commandName: string) => Promise<EventMeta>|EventMeta
 * @return {Function}                       (Express.Route, bootstrapped: Object) => Express.Route
 */
function createDispatcher (commands, options = {}) {
  const defaultCreateMeta = (req) => ('user' in req ? { user: req.user } : {})
  const createMeta = options.createMeta || defaultCreateMeta

  /**
   * @param {Express.Route} route       Path must contain a `:command` or `:commandName` route param.
   * @param {Object} bootstrapped       Internal state of `bootstrap()`.
   * @param {Store}  bootstrapped.store Flux capacitor store.
   * @return {Express.Route}
   */
  return function setUpDispatchRoute (route, { store }) {
    assert(store, `createDispatcher(): No store set yet. Use 'use.store()' before.`)

    const dispatchHandler = createDispatchHandler(store, commands, createMeta)
    return route.post(useAsyncHandler(dispatchHandler))
  }
}

/**
 * @param {Store}     store       Flux capacitor store
 * @param {Object}    commands    { [commandName: string]: Function }
 * @param {Function}  createMeta  (Request, commandName: string) => Promise<EventMeta>|EventMeta
 * @return {Function}             (Request, Response) => Promise
 */
function createDispatchHandler (store, commands, createMeta) {
  const runCommand = createCommandRunner(commands)

  return function dispatchHandler (req, res) {
    const commandName = getCommandName(req)

    return Promise.resolve()
      .then(() => createMeta(req, commandName))
      .then((meta) => runCommand(commandName, meta, req.body))
      // Could also dispatch an array of events here
      // Returned events are equal to dispatched events, but an event ID will have been added
      .then((event) => store.dispatch(event))
      .then((processedEvents) => res.json(processedEvents))
  }
}

/**
 * @param {Object} commands   { [commandName: string]: Function }
 * @return {Function}         (name: string, meta: Object, payload: Object) => Promise<Event>|Event
 */
function createCommandRunner (commands) {
  return function runCommand (name, meta, payload) {
    if (name in commands) {
      const handler = commands[ name ]
      const event = handler(payload, meta)
      return event
    } else {
      throw Object.assign(new Error(`Unknown command: ${name}`), { statusCode: 400 })
    }
  }
}

/**
 * @param {Request} req
 * @return {string}
 */
function getCommandName (req) {
  return req.params.commandName || req.params.command
}
