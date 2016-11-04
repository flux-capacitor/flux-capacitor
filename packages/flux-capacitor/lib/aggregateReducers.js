'use strict'

const combineChangesets = require('./database/combineChangesets')

/**
 * Will aggregate multiple reducers to one. Different to redux' `combineReducers`,
 * since our reducers return a diff to apply to the database, instead of a complete
 * new state. So this method merges the reducers' resulting diffs to one.
 *
 * @param {...Function} reducers  Reducer functions.
 * @return {Function}             Aggregated reducer. Invoking this reducers equals invoking all the input reducers.
 */
function aggregateReducers () {
  const reducers = Array.slice(arguments)

  return (database, event) => {
    const changesets = reducers.map((reducer) => reducer(database, event))
    return combineChangesets(changesets)
  }
}

module.exports = aggregateReducers
