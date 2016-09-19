# streamux

- Redux for the backend, means event-based data storage
- Not a new kind of database, but microservice on top of popular databases
- Highlight little code necessary, works like redux
- Isomorphic reducers: Can re-use the store's reducers in the frontend
- Reducers like redux, but with a slight change (`(collection, event) => changeset`)

## Features

- Push notifications and great opportunities for analytics for free, thanks to event stream
- Use same code in frontend and backend (for push notifications)
- Everything is functional and loosely-coupled
- Works with PostgreSQL, MySQL, SQLite & MSSQL using Sequelize right now
- But virtually any database is possible (but you need transaction support)
- Related to CQRS, but no real CQRS, rather something between common CRUD and real CQRS


## How to

### Setup

1. Create DB models
2. Write reducers
3. Create store

### Write data

1. Create event(s)
2. Dispatch event(s) to store
3. Event(s) are reduced, means database is updated + event(s) are persisted
4. Subscribers of the store are informed about the new event(s)

### Read data

What's the flow for reading data? Just read from your DB collections like you always did!

### Write data (under the hood)

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


## Possible follow-up features

- Collection methods: `updateWhere`, `destroyWhere`
- Easy replaying with updated reducers
- Optionally: Periodical snapshots and easy way to recreate state of data at a random point of time ("Time machine")
- Saga support
- Optionally: Move old events periodically to "icelog" (some other, possibly slower, but cheaper storage)
- Support for other storage engines (Mongo, ...)


## Other TODO

- Test reducers returning more than one changeset
