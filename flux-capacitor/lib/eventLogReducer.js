'use strict'

function reduceEvent (database, event) {
  const Events = database.collections.Events
  return Events.create(event)
}

module.exports = reduceEvent
