/*
 * Entry point for the HTTP service. Sets up a RESTful API server.
 */

// Read configuration from .env file and set environment variables (`process.env.*`)
require('dotenv').config()

const authorize = require('flux-capacitor-boot/authorize')
const bootstrap = require('flux-capacitor-boot/express').bootstrap
const createExpressApp = require('flux-capacitor-boot/express').createExpressApp
const createDispatcher = require('flux-capacitor-boot/express').createDispatcher
const createReadRoute = require('flux-capacitor-boot/express').createReadRoute
const createWebSocket = require('flux-capacitor-boot/express').createWebSocket
const use = require('flux-capacitor-boot/express').use

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
.listen(process.env.LISTEN_PORT, process.env.LISTEN_HOST)
.catch((error) => console.error(error.stack))
