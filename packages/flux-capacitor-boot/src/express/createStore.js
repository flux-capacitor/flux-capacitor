const fluxCapacitor = require('flux-capacitor')

module.exports = createStore

/**
 * @param {Function} rootReducer    (Database, Event) => Changeset
 * @param {Database|Promise<Database>} databaseOrPromise  Result of `connectTo()` or `await connectTo()`
 * @return {Promise<Store>}
 */
function createStore (rootReducer, databaseOrPromise) {
  return Promise.resolve(databaseOrPromise).then((database) => {
    return fluxCapacitor.createStore(rootReducer, database)
  })
}
