const createEventsModel = require('./events')
const createNotesModel = require('./notes')

/**
 * @param {Sequelize} sequelize
 * @param {Function} createCollection   (name: string, model: Sequelize.Model) => Collection
 * @return {Collection[]}
 */
function createCollections (sequelize, createCollection) {
  return [
    createCollection('Events', createEventsModel(sequelize)),
    createCollection('Notes', createNotesModel(sequelize))
  ]
}

exports.createCollections = createCollections
