'use strict'

const createChangeset = require('./createChangeset')

/**
 * Takes an array of changesets and returns a single changeset that contains
 * all of the input changeset's DB operations. To be used by database connectors.
 *
 * @param {Changeset[]} changesets
 * @return {Changeset}
 * @private
 */
function combineChangesets (changesets) {
  const actions = changesets.map((changeset) => changeset.apply)

  const combinedAction = function () {
    const args = arguments

    return actions.reduce((promise, action) => (
      promise.then(() => action.apply(null, args))
    ), Promise.resolve())
  }

  return createChangeset(combinedAction)
}

module.exports = combineChangesets
