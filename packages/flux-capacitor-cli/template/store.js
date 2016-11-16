require('dotenv')

const authorize = require('flux-capacitor-boot/authorize')
const { connectTo } = require('flux-capacitor-sequelize')
const {
  bootstrap, createExpressApp, createDispatcher, createStore, createWebSocket, use
} = require('flux-capacitor-boot/express')

const commands = require('./commands')
const createCollections = require('./collections')
const rootReducer = require('./reducers')

bootstrap([
  use.app(createExpressApp()),
  use.store(createStore(rootReducer, connectTo(process.env.DB_CONNECTION, createCollections))),
  use.route('/dispatch/:commandName', createDispatcher(commands), (req) => authorize.allow()),
  use.route('/events(/:id)?', createReadRoute('events', { sortBy: 'timestamp', sortOrder: 'DESC' })),
  use.route('/websocket', createWebSocket())
]).listen(process.env.PORT)
