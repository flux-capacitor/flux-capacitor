/**
 * This file initializes the database connection, launches the REST API server
 * and creates the store.
 */

require('dotenv').config()

const { aggregateReducers, createStore, eventLogReducer } = require('../lib')
const { connectTo } = require('../lib/database/sequelize')
const bodyParser = require('body-parser')
const express = require('express')
const { createDbModels } = require('./database')
const { initRestApi } = require('./rest-api')
const rootReducer = require('./reducers/index')

module.exports = bootstrap()
  .catch((error) => console.error(error.stack))

async function bootstrap () {
  // One of the few differences to redux: Using aggregateReducers which is comparable
  // to redux' `combineReducers`, but working on reducers that return DB operations
  const aggregatedReducer = aggregateReducers(rootReducer, eventLogReducer)

  const database = await connectToDatabase()
  const store = createStore(aggregatedReducer, database)

  return startServer(database, store)
}

async function connectToDatabase () {
  const storagePath = process.env.DB_SQLITE_STORAGE

  return await connectTo(`sqlite://${storagePath}`, createDbModels)
}

function startServer (database, store) {
  const app = express()
  const port = process.env.PORT || 3000

  app.use(bodyParser.json())
  initRestApi(app, database, store)

  return app.listen(port, () => console.log(`Data store running on port ${port}`))
}
