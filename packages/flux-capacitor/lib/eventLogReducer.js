'use strict'

/**
 * @param {Collection} Events
 * @param {Event}      event
 * @return {Changeset}
 */
function reduceEvent (Events, event) {
  return Events.create(event)
}

module.exports = reduceEvent
