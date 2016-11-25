const assert = require('assert')
const authorize = require('../authorize')
const useAsyncHandler = require('./util/useAsyncHandler')

module.exports = {
  /**
   * Make the bootstrapper use this express server app.
   *
   * @param {Express.App|Promise<Express.App>}
   * @return {Function}
   */
  app (appOrPromise) {
    return () => Promise.resolve(appOrPromise)
      .then((app) => ({ app }))
  },

  /**
   * Make the app use this express middlewares.
   *
   * @param {Function|Function[]} middlewares
   * @return {Function}
   */
  expressMiddleware (middlewares) {
    middlewares = Array.isArray(middlewares) ? middlewares : [ middlewares ]

    return ({ app }) => {
      assert(app, `expressMiddleware(): No app set yet. Use 'use.app()' before.`)
      app.use(middlewares)
    }
  },

  /**
   * Set up this RESTful route.
   *
   * @param {string} path
   * @param {Function} handler      (Express.Route) => void
   * @param {Function} [preHandler] For authorization and such. (Request, Response) => Promise|void
   * @return {Function}
   */
  route (path, handler, preHandler = allowAll) {
    return (bootstrapped) => {
      const { app } = bootstrapped
      assert(app, `route(): No app set yet. Use 'use.app()' before.`)

      const route = app.route(path).all(useAsyncHandler(preHandler))
      handler(route, bootstrapped, path)
    }
  },

  /**
   * Make the bootstrapper use this flux capacitor store.
   *
   * @param {Store|Promise<Store>}
   * @return {Function}
   */
  store (storeOrPromise) {
    return () => Promise.resolve(storeOrPromise)
      .then((store) => ({ store }))
  }
}

function allowAll () {
  return authorize.allow()
}
