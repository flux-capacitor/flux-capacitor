/**
 * This file initializes the database connection, launches the REST API server
 * and creates the store.
 */

require('dotenv').config()

const bodyParser = require('body-parser')
const express = require('express')
const helmet = require('helmet')
const path = require('path')
const setUpStore = require('./store')
const { initRestApi } = require('./rest-api')
const { initWebsocketServer } = require('./ws-api')

module.exports = bootstrap()
  .catch((error) => console.error(error.stack))

async function bootstrap () {
  return startServer(await setUpStore())
}

function startServer (store) {
  const app = express()
  const port = process.env.PORT || 3000
  const staticFilesPath = path.join(__dirname, 'assets')

  const apiRouter = initRestApi(store)
  initWebsocketServer(app, store)

  app.use(helmet())
  app.use(express.static(staticFilesPath))
  app.use(bodyParser.json())
  app.use('/api', apiRouter)

  return app.listen(port, () => console.log(`Sample app running on port ${port}`))
}
