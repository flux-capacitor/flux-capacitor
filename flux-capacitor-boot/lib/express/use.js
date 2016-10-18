module.exports = {
  app (app) {
    return () => ({ app })
  },

  route (route, handler) {
    return ({ app }) => {
      handler(app.route(route))
    }
  },

  store (store) {
    return () => ({ store })
  }
}
