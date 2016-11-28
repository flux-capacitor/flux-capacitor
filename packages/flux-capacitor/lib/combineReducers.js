'use strict'

const combineChangesets = require('./database/combineChangesets')

module.exports = combineReducers

/**
 * Will combine multiple collection reducers to one database reducer.
 * Takes an object whose keys are collection names and whose values are
 * reducer functions.
 *
 * The input reducers have the signature `(Collection, Event) => Changeset`,
 * the resulting combined reducer is `(Database, Event) => Changeset`.
 *
 * @param {object} reducers   { [collectionName: string]: Function }
 * @return {Function}
 */
function combineReducers (reducers) {
  const databaseReducers = Object.keys(reducers)
    .map((collectionName) => {
      const reducer = reducers[ collectionName ]
      return createDatabaseReducer(reducer, collectionName)
    })

  return (database, event) => {
    const changesets = databaseReducers.map((reducer) => reducer(database, event))
    return combineChangesets(changesets)
  }
}

/**
 * Takes a collection reducer and turns it into a database reducer by binding it
 * to one of the database's collections.
 *
 * @param {Function} collectionReducer    (Collection, Event) => Changeset
 * @param {string}   collectionName
 * @return {Function}                     (Database, Event) => Changeset
 */
function createDatabaseReducer (collectionReducer, collectionName) {
  return (database, event) => {
    const collection = database.collections[ collectionName ]

    if (!collection) {
      throw new Error(`Collection '${collectionName}' not known by database instance.`)
    }

    return collectionReducer(collection, event)
  }
}
