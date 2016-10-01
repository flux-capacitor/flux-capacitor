# Concept (Work in Progress)

## Writing data

1. Create event(s)
2. Dispatch event(s) to store
3. Event(s) are reduced, means database is updated + event(s) are persisted
4. Subscribers of the store are informed about the new event(s)

TODO: Insert code snippet here


## Reading data

Reading data is as simple as it always has been. Just read the collections:

TODO: Insert code snippet here


## What happens under the hood

1. Store receives event(s) on dispatch()
2. Creates new transaction
3. Applies all known reducers on event(s), resulting in a set of changesets
   (A changeset is just a database operation or a set of database operations)
   (Persisting the event itself is also just done by a reducer)
4. Apply changesets to the database as part of the transaction (a.k.a. perform INSERT, UPDATE, ...)
5. Commit transaction or rollback if something went wrong
6. Pass event(s) to the store's subscribers
