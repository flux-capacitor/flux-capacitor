const Sequelize = require('sequelize')
const createCollection = require('./createCollection')
const createTransaction = require('./createTransaction')

/**
 * Connect to a database using Sequelize ORM.
 *
 * @param {string} connectionUrl
 * @param {Function} createModels
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

    transaction (callback) {
      return sequelize.transaction((sequelizeTransaction) => {
        const transaction = createTransaction(database, sequelizeTransaction)
        return callback(transaction)
      })
    }
  }

  return sequelize.sync().then(() => database)
}

exports.connectTo = connectTo

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
