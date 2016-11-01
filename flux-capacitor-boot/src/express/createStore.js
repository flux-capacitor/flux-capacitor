const fluxCapacitor = require('flux-capacitor')

module.exports = createStore

/**
 * @param {Function} rootReducer    (Database, Event) => Changeset
 * @param {Database|Promise<Database>} databaseOrPromise  Result of `connectTo()` or `await connectTo()`
 * @return {Promise<Function>}
 */
function createStore (rootReducer, databaseOrPromise) {
  return () => Promise.resolve(databaseOrPromise).then((database) => {
    const store = fluxCapacitor.createStore(rootReducer, databaseOrPromise)
    return { store }
  })
}
