# Flux Capacitor - Bootstrapper

[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![NPM Version](https://img.shields.io/npm/v/flux-capacitor-boot.svg)](https://www.npmjs.com/package/flux-capacitor-boot)

Bootstrapping utils for the [Flux Capacitor](https://github.com/flux-capacitor/flux-capacitor) for setting it up as an HTTP service in a simple, yet customizable way.


## Usage

```js
require('dotenv').config()
const authorize = require('flux-capacitor-boot/authorize')
const { connectTo } = require('flux-capacitor-sequelize')
const { bootstrap, createExpressApp, createDispatcher, createRetrievalRoutes, createStore, createWebSocket, use } = require('flux-capacitor-boot/express')

const commands = require('./commands')
const createCollections = require('./collections')
const rootReducer = require('./reducers')

bootstrap([
  // ({ app, routes, store }) => Promise.resolve({ app, routes, store }),
  use.app(createExpressApp()),
  use.store(createStore(rootReducer, connectTo(process.env.DB_CONNECTION, createCollections))),
  use.route('/dispatch/:commandName', createDispatcher(commands/*, (req, events) => authorize.allow()*/)),
  use.route('/:collectionName', createRetrievalRoutes([ 'events', 'notes' ]/*, (req, collection) => authorize.allow()*/)),
  use.route('/websocket', createWebSocket({
    /*authorize: (message, websocket) => authorize.allow(),*/
  }))
]).listen(process.env.PORT)
```


## Flux Capacitor

Find it here 👉 [Flux Capacitor](https://github.com/flux-capacitor/flux-capacitor)


## License

Released under the terms of the MIT license.
