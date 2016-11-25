/*
 * This file contains the command handlers. They take command data included in
 * the HTTP request and return an event that will be dispatched. You could also
 * dispatch multiple events at once.
 */

const noteCommands = require('./notes')

module.exports = merge([
  noteCommands
])

function merge (objects) {
  return objects.reduce((merged, object) => Object.assign(merged, object), {})
}
