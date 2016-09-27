# Flux Capacitor

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

#### What does the data in the database look like?

See the contents of the sample app's database after some operations:

**Notes**

|                 id                   |        createdAt        |    title    |       text        |
| ------------------------------------ | ----------------------- | ----------- | ----------------- |
| ab0bb5ac-cc8e-4acf-b849-abbc386ae784 | 2016-09-26 20:32:46.588 | Hello World | I am a test note. |
| 45f2a1e9-a0f3-4b60-a2cb-8031634220d1 | 2016-09-26 20:44:44.928 | Note #2     | ¯\\_(ツ)_/¯        |

**Events**

|                 id                   |        timestamp        |   type    |       payload        |    meta     |
| ------------------------------------ | ----------------------- | --------- | ----------------- |
| 194130b2-49d3-45c0-8232-d773fe37738c | 2016-09-26 20:32:46.589 | noteAdded | {"id":"ab0bb5ac-cc8e-4acf-b849-abbc386ae784", "title":"Hello World", "text":"I am a test note.", "createdAt":"2016-09-26T20:32:46.588Z"} | {"user":"George"}
| 7d2ecc6b-47e6-4789-9e5b-3476a786ab27 | 2016-09-26 20:44:44.928 | noteAdded | {"id":"45f2a1e9-a0f3-4b60-a2cb-8031634220d1", "title":"Note #2", "text":"¯\\_(ツ)_/¯", "createdAt":"2016-09-26T20:44:44.928Z"} | {"user":"Tony"}
| d4359bba-8518-4fe1-ae3f-aad5cfedcc44 | 2016-09-26 20:44:54.491 | noteAdded | {"id":"f44f32f3-91af-4a4e-bb9e-053aef435117", "title":"Some other note", "text":"", "createdAt":"2016-09-26T20:44:54.491Z"} | {"user":"Tony"}
| 68134d88-fbcf-4a9c-b610-6b1f4385e816 | 2016-09-26 20:55:46.822 | noteTitleEdited | {"id":"f44f32f3-91af-4a4e-bb9e-053aef435117", "title":"Yet another note"} | {"user":"Mary"}
| f447119c-5a46-4419-8e94-67978db5dfd3 | 2016-09-26 20:56:28.919 | noteRemoved | {"id":"f44f32f3-91af-4a4e-bb9e-053aef435117"} | {"user":"Mary"}

**As you can see we now have much more data than we would usually have. We can restore the deleted note with all its contents. We can trace back any changes made to the notes. And we even have a detailed log showing when any event was dispatched and by whom** 🎉


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

So how does it work? Find details here: [Concept](./flux-capacitor/CONCEPT.md).


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


## License

This library is released under the terms of the MIT license. See [LICENSE](./LICENSE) for details.
