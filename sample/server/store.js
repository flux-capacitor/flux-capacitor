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
  if (!process.env.DB_CONNECTION) {
    throw new Error(`Environment variable 'DB_CONNECTION' must be set. Check your '.env' file. See '.env.default', too.`)
  }

  const connectionSettings = process.env.DB_CONNECTION.startsWith('{')
    ? JSON.parse(process.env.DB_CONNECTION)
    : process.env.DB_CONNECTION

  return connectTo(connectionSettings, createCollections)
}
