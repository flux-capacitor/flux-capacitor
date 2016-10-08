# Flux Capacitor - ToDo

## Flux Capacitor (core & database bindings)

- Easier store setup
- Test reducers returning more than one changeset
- **Easy replaying with updated reducers a.k.a migrating to new data model without writing migrations and with zero down-time**
- **Time machine: Periodical snapshots and easy way to recreate state of data at a random point of time**
- New collection methods: `updateWhere`, `destroyWhere`
- Flow types
- Saga support
- Make reducers usable in frontend with other libs than Redux as well: MobX, RxJs
- Move old events periodically to "icelog" (some other, possibly slower, but cheaper storage: Amazon Glacier for instance)
- Support for other storage engines (Mongo, ...)

- Submit to https://github.com/xgrommx/awesome-redux
- Submit to https://jslive.com


## Sample app

- Add footer containing links to GitHub repo, create-react-app, redux
- Rewrite for cooler use case: Trello board
- Try integrating Push API: https://github.com/chrisdavidmills/push-api-demo


## Feature: Time Machine

- Needs snapshotting
- Needs performant diffing on data
- Need to define: How to store snapshots?
  - Simplest solution for snapshots:
    - Add table to the DB: `FluxCapSnapshot_${snapshotId}`: `collectionName, itemId, itemData, [... possibly user-defined cols for faster querying]`
    - Add table to the DB: `FluxCapSnapshots`: `snapshotId, baseSnapshot, eventId, eventTime, createdAt`
- Snapshots might be
  - Full snapshots (consume a lot of memory, but are fast to query)
  - Incremental snapshots (consume way less memory, but are slow to query)
  - Maybe: Differential snapshots (like incremental, but always based on the last *full* snapshot)
