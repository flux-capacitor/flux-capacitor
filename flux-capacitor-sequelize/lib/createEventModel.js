'use strict'

const Sequelize = require('sequelize')

module.exports = createEventModel

const defaultModel = {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
    allowNull: false
  },
  timestamp: {
    type: Sequelize.DATE,       // TODO: TIMESTAMP would be better, but is not supported by sequelize right now
    allowNull: false
  },
  type: {
    type: Sequelize.STRING,
    allowNull: false
  },
  payload: {
    type: Sequelize.JSON,
    get () {
      return parseJsonObject(this.getDataValue('payload'))
    }
  },
  meta: {
    type: Sequelize.JSON,
    get () {
      return parseJsonObject(this.getDataValue('meta'))
    }
  }
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

/**
 * Parses a given JSON-encoded object. If it's already parsed (typeof 'object')
 * then just return it.
 * This is necessary, since data type `Sequelize.JSON` will provide us with an
 * already parsed value on Postgres, but will fall back to an unparsed
 * JSON-encoded string on other databases.
 *
 * @param {string|object} value
 * @return {object}
 */
function parseJsonObject (value) {
  return typeof value === 'string'
    ? JSON.parse(value)
    : value
}
