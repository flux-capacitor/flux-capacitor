const createEventsModel = require('./events')
const createNotesModel = require('./notes')

function createDbModels (sequelize) {
  return {
    Events: createEventsModel(sequelize),
    Notes: createNotesModel(sequelize)
  }
}

exports.createDbModels = createDbModels
