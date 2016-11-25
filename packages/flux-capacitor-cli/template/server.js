/*
 * Entry point for the HTTP service. Sets up a RESTful API server.
 */

// Read configuration from .env file and set environment variables (`process.env.*`)
require('dotenv').config()

const authorize = require('flux-capacitor-boot/authorize')
const { connectTo } = require('flux-capacitor-sequelize')
const { bootstrap, createExpressApp, createDispatcher, createReadRoute, createWebSocket, use } = require('flux-capacitor-boot/express')

const commands = require('./commands')
const initStore = require('./store')

bootstrap([
  use.app(createExpressApp()),
  use.store(initStore()),
  use.route('/dispatch/:commandName', createDispatcher(commands), (req) => authorize.allow()),
  use.route('/events(/:id)?', createReadRoute('Events', { sortBy: 'timestamp', sortOrder: 'DESC' })),
  use.route('/notes(/:id)?', createReadRoute('Notes')),
  use.route('/websocket', createWebSocket())
])
.listen(process.env.PORT)
.catch((error) => console.error(error.stack))
