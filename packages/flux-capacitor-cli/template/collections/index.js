/*
 * Exports the function that creates all the collections.
 * A collection is a database table. It has got a data model and some metadata.
 */

const createEventCollection = require('./events')
const createNotesCollection = require('./notes')

module.exports = createCollections

/**
 * @param {Sequelize} sequelize
 * @return {Collection[]}
 */
function createCollections (sequelize) {
  return [
    createEventCollection(sequelize),
    createNotesCollection(sequelize)
  ]
}
