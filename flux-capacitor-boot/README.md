# Flux Capacitor - Bootstrapper

[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![NPM Version](https://img.shields.io/npm/v/flux-capacitor-boot.svg)](https://www.npmjs.com/package/flux-capacitor-boot)

Bootstrapping utils for the [Flux Capacitor](https://github.com/flux-capacitor/flux-capacitor) for setting it up as an HTTP service in a simple, yet customizable way.


## Usage

```js
require('dotenv').config()
const authorize = require('flux-capacitor-boot/authorize')
const { connectTo } = require('flux-capacitor-sequelize')
const {
  bootstrap, createExpressApp, createDispatcher, createStore, createWebSocket, use
} = require('flux-capacitor-boot/express')

const commands = require('./commands')
const createCollections = require('./collections')
const rootReducer = require('./reducers')

bootstrap([
  // ({ app, routes, store }) => Promise.resolve({ app, routes, store }),
  use.app(createExpressApp()),
  use.store(createStore(rootReducer, connectTo(process.env.DB_CONNECTION, createCollections))),
  use.route('/dispatch/:commandName', createDispatcher(commands)/*, (req) => authorize.allow()*/),
  use.route('/events(/:id)?', createReadRoute('events', { sortBy: 'timestamp', sortOrder: 'DESC' })),
  use.route('/notes(/:id)?', createReadRoute('notes')/*, (req) => authorize.allow()*/),
  use.route('/websocket', createWebSocket({
    /* (event, websocket) => authorize.allow(), */
  }))

  // Optionally add custom express middlewares you need:
  // use.expressMiddleware([ someMiddleware ])
]).listen(process.env.PORT)

function readEvents (collection, createQueryOptions) {
  const options = createQueryOptions('id', 'timestamp')
  return collection.findAll(options)
}
```

## Use custom express app

If you want to use an existing express app or want to use some custom app then just pass it to `use.app()` instead of using `createExpressApp()`:

```js
const bodyParser = require('body-parser')
const express = require('express')
const { bootstrap, use } = require('flux-capacitor-boot/express')

const app = express()

bootstrap([
  use.app(app),
  use.expressMiddleware([ bodyParser.json() ]),   // the dispatcher needs this middleware, createExpressApp() would have set it up for us
  ...
])
```


## Authorization

```js
const authorize = require('flux-capacitor-boot/authorize')
const { bootstrap, use } = require('flux-capacitor-boot/express')

bootstrap([
  use.route('/some/route', someHandler, authorize)
])

// Must return authorize.allow() or authorize.deny(Error) or a promise.
function authorize (req) {
  if (!req.user) {
    return authorize.deny('You are not logged in or there is no express middleware for authentication set.')
  }

  if (req.user === 'John') {
    return authorize.allow()
  } else {
    // Can also pass an error object to `authorize.deny()`
    return authorize.deny('Only John is allowed to use this route.')
  }
}
```


## Flux Capacitor

Find it here 👉 [Flux Capacitor](https://github.com/flux-capacitor/flux-capacitor)


## License

Released under the terms of the MIT license.
