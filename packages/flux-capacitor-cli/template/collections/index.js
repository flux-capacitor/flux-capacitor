const createEventsModel = require('./events')

/**
 * @param {Sequelize} sequelize
 * @param {Function} createCollection   (name: string, model: Sequelize.Model) => Collection
 * @return {Collection[]}
 */
function createCollections (sequelize, createCollection) {
  return [
    createCollection('Events', createEventsModel(sequelize))
  ]
}

exports.createCollections = createCollections
