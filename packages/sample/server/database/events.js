/**
 * Event model definition. Specifies the data model of the event log.
 * We just use the default model here.
 */

const createEventModel = require('flux-capacitor-sequelize').createEventModel

module.exports = createEventModel
