# Changelog - flux-capacitor

## 0.3.0

Replace `aggregateReducers()` by `combineReducers()`.

Two benefits:
1. Forces the reducers to work on a single collection (also a handy limitation if you want to use reduxify)
2. Closer to the Redux API

Drawback:
Now the root reducer (result of `combineReducers()`) has a different signature (`(database, event) => changeset`) than the other reducers (`(collection, event) => changeset`).


## 0.2.2

- Bugfix: Make compatible with node 4.x
- Minor bugfix: Only create event ID on dispatch if there is no event ID yet

## 0.2.1

- Moved reduxify into separate npm package: `flux-capacitor-reduxify`

## 0.2.0

Initial release. Versions 0.1.x are left-overs of a former npm package using the same package name.
