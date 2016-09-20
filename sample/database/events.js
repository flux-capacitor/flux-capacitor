/**
 * Event model definition. Specifies the data model of the event log.
 * We just use the default model here.
 */

const createEventModel = require('../../database-sequelize').createEventModel

module.exports = createEventModel
