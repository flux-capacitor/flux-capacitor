const Sequelize = require('sequelize')

const defaultModel = {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
    allowNull: false
  },
  timestamp: {
    type: Sequelize.DATE,       // TODO: TIMESTAMP would be better, but is not supported by sequelize right now
    allowNull: false,
    defaultValue: Sequelize.NOW
  },
  type: {
    type: Sequelize.STRING,
    allowNull: false
  },
  payload: Sequelize.JSON,
  meta: Sequelize.JSON
}

const indexes = [
  {
    fields: [ 'type' ]
  }, {
    fields: [ 'timestamp' ]
  }
]

/**
 * Create a default event table model. May be customized by passing your own model definition / options.
 *
 * @param {Sequelize} sequelize
 * @param {Object}    [modelDef]      Custom model definition (the model's fields) to merge into default
 * @param {Object}    [modelOptions]  Custom model options (indexes, etc.) to merge into default ones
 * @return {Sequelize.Model}
 */
function createEventModel (sequelize, modelDef, modelOptions) {
  const defaultModelOptions = {
    indexes, timestamps: false
  }

  modelDef = Object.assign({}, defaultModel, modelDef)
  modelOptions = Object.assign({}, defaultModelOptions, modelOptions)

  return sequelize.define('event', modelDef, modelOptions)
}

module.exports = createEventModel
