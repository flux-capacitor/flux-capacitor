'use strict'

const Sequelize = require('sequelize')
const uuid = require('uuid')
const createCollection = require('./createCollection')
const createTransaction = require('./createTransaction')

module.exports = connectTo

/**
 * Connect to a database using Sequelize ORM.
 *
 * @param {string} connectionUrl        For instance: `sqlite://path/to/db.sqlite`
 * @param {Function} createCollections  (sequelize: Sequelize, createCollection: (name: string, model: Sequelize.Model) => Collection) => Array<Collection>
 * @return {Database}
 */
function connectTo (connectionUrl, createCollections) {
  const sequelize = new Sequelize(connectionUrl)
  const collections = createCollections(sequelize, createCollection)

  const database = {
    /** @property {Sequelize} connection */
    connection: sequelize,

    /** @property {Object} collections    { [name: string]: Collection } */
    collections: collectionsAsKeyValue(collections),

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
 * @param {Array<Collection>} collections
 * @return {Object}           { [name: string]: Collection }
 */
function collectionsAsKeyValue (collections) {
  const keyValueObject = {}

  collections.forEach((collection) => {
    if (typeof collection !== 'object') {
      throw new Error(`Expected a collection. Got: ${typeof collection}`)
    }
    if (!collection.name) {
      throw new Error(`Expected collection to have a name.`)
    }
    keyValueObject[ collection.name ] = collection
  })

  return keyValueObject
}
