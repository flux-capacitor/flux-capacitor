/*
 * Event model definition. Specifies the data model of the event log.
 */

const createCollection = require('flux-capacitor-sequelize').createCollection
const createEventModel = require('flux-capacitor-sequelize').createEventModel

module.exports = createEventCollection

function createEventCollection (sequelize) {
  // We use the default model here
  return createCollection('Events', createEventModel(sequelize))
}
