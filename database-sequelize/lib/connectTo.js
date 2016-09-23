const Sequelize = require('sequelize')
const uuid = require('uuid')
const createCollection = require('./createCollection')
const createEventModel = require('./createEventModel')
const createTransaction = require('./createTransaction')

module.exports = connectTo

/**
 * Connect to a database using Sequelize ORM.
 *
 * @param {string} connectionUrl    For instance: `sqlite://path/to/db.sqlite`
 * @param {Function} createModels   (sequelize: Sequelize) => { [ collectionName: string ]: Sequelize.Model }
 * @return {Database}
 */
function connectTo (connectionUrl, createModels) {
  const sequelize = new Sequelize(connectionUrl)
  const models = createModels(sequelize)

  const database = {
    connection: sequelize,
    collections: createCollections(models),

    applyChangeset (changeset, options) {
      options = options || { transaction: null }
      return changeset.apply(options.transaction)
    },

    createEventId () {
      return uuid.v4()
    },

    transaction (callback) {
      return sequelize.transaction((sequelizeTransaction) => {
        const transaction = createTransaction(database, sequelizeTransaction)
        return callback(transaction)
      })
    }
  }

  return sequelize.sync().then(() => database)
}

/**
 * @param {object} models   { [ collectionName: string ]: Sequelize.Model }
 * @return {object} { [ collectionName ]: Collection }
 */
function createCollections (models) {
  const collectionsByName = {}

  Object.keys(models).forEach((name) => {
    collectionsByName[ name ] = createCollection(name, models[ name ])
  })

  return collectionsByName
}
