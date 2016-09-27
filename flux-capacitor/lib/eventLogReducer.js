'use strict'

function reduceEvent (database, event) {
  const { Events } = database.collections
  return Events.create(event)
}

module.exports = reduceEvent
