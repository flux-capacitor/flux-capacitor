# Flux Capacitor - Sequelize Database Bindings

[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

Database bindings for the [Flux Capacitor](https://github.com/flux-capacitor/flux-capacitor). Uses [Sequelize ORM](http://sequelizejs.com) to connect to PostgreSQL, MySQL, SQLite and MSSQL databases.


## Usage

Here comes some sample code showing how to connect to a database, set up a simple data model and create a flux capacitor store using it:

```js
// Import the database-agnostic core library:
const { aggregateReducers, createStore, eventLogReducer } = require('flux-capacitor')
// Import the database-backend:
const { connectTo } = require('flux-capacitor-sequelize')
const createEventModel = require('flux-capacitor-sequelize').createEventModel

const Sequelize = require('sequelize')

async function setUpStore () {
  // Connect to database
  const database = await connectTo('postgres://user:pass@example.com:5432/dbname', createCollections)
  // Use the default event log reducer (event persistence is done by a simple reducer as well)
  const rootReducer = aggregateReducers(reducer, eventLogReducer)
  // Create store
  return await createStore(rootReducer, database)
}

function createCollections (sequelize, createCollection) {
  return [
    createCollection('Events', createEventModel(sequelize)),
    createCollection('Issues', createIssueModel(sequelize))
  ]
}

function createIssueModel (sequelize) {
  return sequelize.define('Issue', {
    id: { type: Sequelize.UUID, primaryKey: true },
    title: { type: Sequelize.STRING, allowNull: false },
    content: { type: Sequelize.TEXT },
  })
}
```


## License

Released under the terms of the MIT license.
