# Ideas

## Event types

Might be a good idea to propose `collection/action` (or just `action` if not related to a particular collection) as best-practice event type.

## Provide configurable REST / websocket server out of the box

See title. So bootstrapping becomes even easier. Maybe a tiny CLI, too.

## In-memory "database backend"

For testing, time machine, etc. Reduxify might just use this under the hood.

## Time Machine

Maybe it makes sense to equip the changesets not only with update, but also with reversion logic.

=> collection's changeset creators become bigger, but going back in time might often be cheaper than replaying on top of an old snapshot
  => probably you often want to view a recent state
