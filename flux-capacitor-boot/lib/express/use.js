const assert = require('assert')
const authorize = require('../authorize')
const useAsyncHandler = require('./util/useAsyncHandler')

module.exports = {
  app (app) {
    return () => ({ app })
  },

  expressMiddleware (middlewares) {
    middlewares = Array.isArray(middlewares) ? middlewares : [ middlewares ]

    return ({ app }) => {
      assert(app, `expressMiddleware(): No app set yet. Use 'use.app()' before.`)
      app.use(middlewares)
    }
  },

  /**
   * @param {string} path
   * @param {Function} handler      (Express.Route) => void
   * @param {Function} [preHandler] For authorization and such. (Request, Response) => Promise|void
   */
  route (path, handler, preHandler) {
    preHandler = preHandler || allowAll

    return (bootstrapped) => {
      const { app } = bootstrapped
      assert(app, `route(): No app set yet. Use 'use.app()' before.`)

      const route = app.route(path).all(useAsyncHandler(preHandler))
      handler(route, bootstrapped, path)
    }
  },

  store (store) {
    return () => ({ store })
  }
}

function allowAll () {
  return authorize.allow()
}
