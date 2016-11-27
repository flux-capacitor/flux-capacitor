/*
 * Flux capacitor store instantiation. Takes collections, reducers and the
 * database connection URL to set up a store instance.
 */

// Read configuration from .env file and set environment variables (`process.env.*`)
require('dotenv').config()

const createStore = require('flux-capacitor-boot/express').createStore
const connectTo = require('flux-capacitor-sequelize').connectTo

const createCollections = require('./collections')
const rootReducer = require('./reducers')

module.exports = initStore

/**
 * @return {Promise<Store>}
 */
function initStore () {
  const connectionSettings = parseConnectionUrl(process.env.DB_CONNECTION)
  return createStore(rootReducer, connectTo(connectionSettings, createCollections))
}

function parseConnectionUrl (connection) {
  if (!connection) {
    throw new Error(`Environment variable 'DB_CONNECTION' must be set. Check your '.env' file. See '.env.default', too.`)
  }

  return connection.startsWith('{')
    ? JSON.parse(connection)
    : connection
}
