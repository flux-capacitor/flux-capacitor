'use strict'

/**
 * Default eventlog reducer. Just adds every event to the `Events` collection.
 *
 * @param {Database} database
 * @param {Event}    event
 * @return {Changeset}
 * @alias eventLogReducer
 * @example
 * const aggregatedReducer = aggregateReducers(rootReducer, eventLogReducer)
 * const database = await connectToDatabase()
 *
 * return createStore(aggregatedReducer, database)
 */
function reduceEvent (database, event) {
  const Events = database.collections.Events
  return Events.create(event)
}

module.exports = reduceEvent
