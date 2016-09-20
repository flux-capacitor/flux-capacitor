# ⏩ FastForward

A modern and versatile approach towards data storage. Easy to use, event-based, functional.

- Like redux for the backend, event-based persistent data storage
- Not a new kind of database, but microservice on top of popular databases
- Works like redux, needs very little effort to provide complex features (see [No code is good code](#no-code-is-good-code))
- Isomorphic reducers: Can re-use the store's reducers in the frontend!
- Reducers similar to redux' reducers

**Alpha release - Keep your seatbelt fastened during the flight**


## Features

- Dispatch events to change data
- Push notifications and powerful analytics come for free, thanks to event log
- Isomorphic reducers - Use same code in frontend and backend to update data
- Upcoming feature: Never write a database migration again - Replay events with new reducers
- Upcoming feature: Time machine - view the database contents at some point in the past
- Works with PostgreSQL, MySQL, SQLite & MSSQL using Sequelize right now


## Show me some code!

Here is some minimal sample code to get going:

```js
TODO
```

Check out the [sample app](./sample/server).

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

##### Code to re-use backend reducer in frontend with redux (sample app)
< 10 SLOC


## How to

### Setup

1. Create DB models
2. Write reducers
3. Create store

TODO: Insert code snippet here

### Write some data

1. Create event(s)
2. Dispatch event(s) to store
3. Event(s) are reduced, means database is updated + event(s) are persisted
4. Subscribers of the store are informed about the new event(s)

TODO: Insert code snippet here

### Read some data

What's the flow for reading data? Just read from your DB collections like you always did!

TODO: Insert code snippet here


### What happens under the hood

1. Store receives event(s) on dispatch()
2. Creates new transaction
3. Applies all known reducers on event(s), resulting in a set of changesets
   (A changeset is just a database operation or a set of database operations)
   (Persisting the event itself is also just done by a reducer)
4. Apply changesets to the database as part of the transaction (a.k.a. perform INSERT, UPDATE, ...)
5. Commit transaction or rollback if something went wrong
6. Pass event(s) to the store's subscribers


## Differences to redux

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
- Saga support
- Make reducers usable in frontend with other libs than redux as well: MobX, RxJs
- Optionally: Move old events periodically to "icelog" (some other, possibly slower, but cheaper storage)
- Support for other storage engines (Mongo, ...)


## Other TODO

- Test reducers returning more than one changeset
- Add footer to sample frontend and add links to GitHub repo, create-react-app, redux


## License

This library is released under the terms of the MIT license. See [LICENSE](./LICENSE) for details.
