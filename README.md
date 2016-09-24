# Flux Capacitor

Data storage as it's supposed to be. Easy to use, event-based, functional. Gives you control over time and data.

*"Your UI and data flow are reactive and event-oriented. So why isn't your database?"*

[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

- Works like [Redux](https://github.com/reactjs/redux), but in the backend and with persistent data
- Not a new kind of database, but microservice on top of popular databases
- Provides complex features with little effort (see [No code is good code](#no-code-is-good-code))
- Isomorphic reducers: Can re-use the store's reducers in the frontend!

**Alpha release - Keep your seatbelt fastened during the entire flight**


## Features

- Dispatch events to change data
- Events (basically flux actions) are persisted, too
- Realtime data and powerful analytics come for free
- For critical data and collaboration: Trace back which events produced today's data
- Isomorphic reducers - Use same code in frontend and backend to update data
- Middleware concept allows massive extensibility
- Upcoming feature: Never write a database migration again - Replay events with new reducers
- Upcoming feature: Time machine - view the database contents at some point in the past
- Works with PostgreSQL, MySQL, SQLite & MSSQL using Sequelize right now


## Show me some code!

Here is how you set up a simple store for storing issues (like GitHub issues):

```js
// Import the database-agnostic core library:
const { aggregateReducers, createStore, eventLogReducer } = require('flux-capacitor')
// Import the database-backend:
const { connectTo } = require('flux-capacitor-sequelize')
const createEventModel = require('flux-capacitor-sequelize').createEventModel

const Sequelize = require('sequelize')
const uuid = require('uuid')

const ADD_ISSUE = 'addIssue'

run().catch((error) => console.error(error.stack))

async function run () {
  // Connect to database
  const database = await connectTo('sqlite://db.sqlite', createCollections)
  // Use the default event log reducer (yes, the event persistence is done by a simple reducer, too :))
  const rootReducer = aggregateReducers(reducer, eventLogReducer)
  // Create store
  const store = await createStore(rootReducer, database)

  store.subscribe((events) => {
    // Subscribe to event dispatchments. Push the events to the clients using a websocket to implement realtime updates, for instance.
    events.forEach((event) => console.log('New event:', event))
  })

  // Create a new issue
  await store.dispatch({
    type: ADD_ISSUE,
    payload: {
      id: uuid.v4(),
      title: 'How to use your product?',
      content: 'Your new project looks awesome, but how to use it... ¯\\_(ツ)_/¯'
    }
  })

  // Print all issues
  console.log(await getAllIssues(database))
}

// The reducer works like a redux reducer, just that it takes a database instance and returns a database changeset
function reducer (database, event) {
  const { Issues } = database.collections

  switch (event.type) {
    case ADD_ISSUE:
      return Issues.create(event.payload)
    default:
      return Issues.noChange()
  }
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

async function getAllIssues (database) {
  const { Issues } = database.collections

  return await Issues.findAll()
}
```

Reusing the backend reducer in your redux-based frontend is dead-easy:

```js
import { reduxify } from 'flux-capacitor'
import { combineReducers } from 'redux'
import backendReducer from './path/to/my/backend/code'

// Note: backendReducer is supposed to take one collection only, not the whole database
// => backendReducer: (Collection, Event) => Changeset
const reduxReducer = reduxify(backendReducer)

const reduxRootReducer = combineReducers({ foo: reduxReducer })
```

Check out the [sample app](./sample/server) to see the whole picture 🖼

#### Backend

- [Store initialization](./sample/server/store.js)
- [DB model definition](./sample/server/database/notes.js)
- [Reducer definition](./sample/server/reducers/notes.js)
- [Server](./sample/server/server.js)

#### Frontend

- [Reusing the reducer](./sample/frontend/src/ducks/notes.js)

#### What does an event look like?

The events passed into the store are supposed to be [Flux standard actions](https://github.com/acdlite/flux-standard-action):

```js
{
  type: 'SOME_TYPE',
  payload: {
    ...
  },
  meta: {     // optional
    ...
  }
}
```

After dispatching the persisted events also contains:

```js
  id:        'c4490491-2c55-43e7-ae88-8ca8045c0fd2'   // some random UUIDv4
  timestamp: '2016-09-20T07:04:21.000Z'               // timestamp is also added
```

## No code is good code

You know what's better than writing a lot of bug-free code? Writing only very few
bug-free code that achieves the same!

##### Code to initialize the store (sample app)
< 20 SLOC

##### Code to set up a tiny data model (sample app)
< 40 SLOC

##### Code spent on reducers (sample app; 1 x create, 2 x update, 1 x delete)
< 40 SLOC

##### Code to push updates to clients using web sockets (sample app)
< 20 SLOC

##### Code to re-use backend reducer in frontend with Redux (sample app)
< 10 SLOC


## Concept

So how does it work? Find details here: [Concept](./CONCEPT.md).


## Differences to Redux

- Reducers work slightly different (`(collection, event) => changeset`)
  - Get a collection, not the whole state and return a changeset, not another complete state
- `aggregateReducers()` instead of `combineReducers()`
  - `aggregateReducers` does pretty much the same, but takes an array of reducers, rather than an object (since a tree of reducers doesn't make much sense when working on DB collections)


## Differences to real CQRS

It is related to CQRS, but no real CQRS. Rather something between common CRUD and real CQRS.

- No distributed system, but just one data storage service (could be easily turned into a master-slave cluster, though)
- No aggregates, just one read model
- This one read model is also used to check business rules when handling an event
- Depends on database transactions to ensure data consistency


## Features to come

- New collection methods: `updateWhere`, `destroyWhere`
- **Easy replaying with updated reducers a.k.a migrating to new data model without writing migrations and with zero down-time**
- **Time machine: Periodical snapshots and easy way to recreate state of data at a random point of time**
- Optional snapshotting for more efficient time machine
- Flow types
- Saga support
- Make reducers usable in frontend with other libs than Redux as well: MobX, RxJs
- Move old events periodically to "icelog" (some other, possibly slower, but cheaper storage: Amazon Glacier for instance)
- Support for other storage engines (Mongo, ...)


## Other TODO

- Test reducers returning more than one changeset
- Add footer to sample frontend and add links to GitHub repo, create-react-app, redux


## License

This library is released under the terms of the MIT license. See [LICENSE](./LICENSE) for details.
