/**
 * Initializes the store. Connects to the database, initializes database models
 * and wires everything up with the reducers.
 */

const { aggregateReducers, createStore, eventLogReducer } = require('../../lib')
const { connectTo } = require('../../database-sequelize')
const { createDbModels } = require('./database')
const rootReducer = require('./reducers/index')

async function setUpStore () {
  // One of the few differences to redux: Using aggregateReducers which is comparable
  // to redux' `combineReducers`, but working on reducers that return DB operations
  const aggregatedReducer = aggregateReducers(rootReducer, eventLogReducer)
  const database = await connectToDatabase()

  return createStore(aggregatedReducer, database)
}

module.exports = setUpStore

function connectToDatabase () {
  const storagePath = process.env.DB_SQLITE_STORAGE

  return connectTo(`sqlite://${storagePath}`, createDbModels)
}
