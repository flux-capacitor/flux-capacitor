/**
 * Initializes the store. Connects to the database, initializes database models
 * and wires everything up with the reducers.
 */

const { aggregateReducers, createStore, eventLogReducer } = require('flux-capacitor')
const { connectTo } = require('flux-capacitor-sequelize')
const { createCollections } = require('./database')
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
  if (!process.env.DB_CONNECTION_URL) {
    throw new Error(`Environment variable 'DB_CONNECTION_URL' must be set. Check your '.env' file. See '.env.default', too.`)
  }
  return connectTo(process.env.DB_CONNECTION_URL, createCollections)
}
