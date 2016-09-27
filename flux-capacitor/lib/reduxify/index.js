'use strict'

const createReduxifyCollection = require('./createReduxifyCollection')

/**
 * Takes a rewinddb reducer and turns it into a redux-compatible reducer.
 *
 * @param {Function} reducer  (Collection, Event) => Changeset
 * @param {string}   [collectionName]
 * @param {Function} (Array<Object>, Action) => Array<Object>
 */
function reduxifyReducer (reducer, collectionName = null) {
  return (state = [], action) => {
    const collection = createReduxifyCollection(state, collectionName)
    const changeset = reducer(collection, action)

    // the changesets returned by the reduxify collections are just plain synchronous methods
    return changeset && changeset !== collection
      ? applyChangeset(state, changeset)
      : state
  }

  function applyChangeset (state, changeset) {
    if (typeof changeset !== 'function') {
      console.error('Reduxify changeset is a plain function. Instead got:', changeset)
      throw new Error('Reduxify changeset is a plain function.')
    }
    // the changesets returned by the reduxify collections are just plain synchronous methods
    return changeset(state)
  }
}

module.exports = reduxifyReducer
