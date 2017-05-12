# ![Flux Capacitor](./media/logo-big.png)

👉 *Flux architecture for the backend. Realtime data and time travel capabilities included.*

[![Build Status](https://travis-ci.org/flux-capacitor/flux-capacitor.svg?branch=master)](https://travis-ci.org/flux-capacitor/flux-capacitor)
[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

- Flux store for your back end's database
- Works like <a href="https://github.com/reactjs/redux" rel="nofollow">Redux</a>
- Dispatch events to change database data
- Events are persisted, thus tracking the database's history
- Pushing realtime data becomes trivial, since you can subscribe to the store for updates
- Great for building collaborative software, activity feeds and debugging

Check out the 👉 [**Sample App**](https://flux-capacitor-notes.now.sh/) to see the flux capacitor in action.

**Alpha release - Keep your seatbelt fastened during the entire flight.**


## White House Users example

```
+------------------------+             +--------------------------------+
| Event: addUser         |  dispatch   | Flux Capacitor Store           |         ╔══> Subscriber
| "Trump"                | ══════════> +--------------------------------+         ║    (Websocket)
+------------------------+             |  Event  +-------------+        |  Event  ║
                                       | ══════> | UserReducer | ════╗  | ════════╬══> Subscriber
+------------------------+  dispatch   |         +-------------+     ║  |         ║    (Logger)
| Event: grantAccess     | ══════════> |                             ║  |         ║
| "Trump": "President"   |             |               DB operations ║  |         ╚══> ...
+------------------------+             +-----------------------------║--+
                                                                     ║
            +--------------------------------------------------------║------+
            | Database (after dispatching)                           ▽      |
            +---------------------------------------------------------------+
            | +-----------------------------------------------------------+ |
            | | Events                                                    | |
            | +-----------------------------------------------------------+ |
            | | Dec 15 2008, 23:16:38  addUser "Barack"                   | |
            | | Dec 15 2008, 23:17:14  grantAccess "Barack": "President"  | |
            | | Dec 19 2016, 22:40:05  addUser "Trump"                    | |
            | | Dec 19 2016, 22:40:23  grantAccess "Trump": "President"   | |
            | +-----------------------------------------------------------+ |
            |                                                               |
            | +---------------+   +------------------------+                |
            | | Users         |   | UserRights             |                |
            | +---------------+   +------------------------+                |
            | | Barack        |   | Barack  "Ex-President" |                |
            | | Trump         |   | Trump "President"      |                |
            | +---------------+   +------------------------+                |
            +---------------------------------------------------------------+
```


## Features

- Isomorphic reducers - Share code between back end and front end
- Middleware concept, compatible with Redux middleware
- No lock-in: Ability to opt-out any time and just use the underlying database directly
- Finer-grained access control - Control write access by event type, not only by table
- Works with PostgreSQL, MySQL, SQLite & MSSQL using Sequelize right now

## Upcoming features

- Time machine - Explore database contents at a random point in the past
- Restore deleted data (can be reconstructed using the event log)
- Never write a database migration again - Replay events with new reducers


## Show me some code!

Find code samples and real database data here:

👉 [**Getting started**](./USAGE.md)


## *No code* is good code

You know what's better than writing a lot of good code? Writing only very few code that achieves the same!

#### Code to initialize the store (sample app)
< 20 SLOC

#### Code to set up a tiny data model (sample app)
< 40 SLOC

#### Code spent on reducers (sample app; 1 x create, 2 x update, 1 x delete)
< 40 SLOC

#### Code to push updates to clients using web sockets (sample app)
< 20 SLOC

#### Code to re-use backend reducer in frontend with Redux (sample app)
< 10 SLOC


## Concept

So how does it work? Find details here: [Flux Capacitor Concept](./flux-capacitor/CONCEPT.md).


## Differences to Redux

Reducers work slightly different. Their signature is `(collection, event) => changeset` instead of `(state, action) => state`. The `action` and the `event` are just synonyms. The real difference is that the flux capacitor reducers take a database collection and return a changeset (a set of database operations).

This is necessary, since we usually cannot hold the complete database in memory as opposed to Redux' state. Returning changesets makes it possible to write the reducers as pure synchronous functions, even though performing those database operations works asynchronously and might lead to side effects.


## Differences to traditional CQRS

It is related to CQRS, but no traditional CQRS. Rather something between common CRUD and traditional CQRS.

- No distributed system by default, but just one data storage service (can be easily turned into a cluster, though)
- No aggregates, just one read model
- This one read model is also used to check business rules when handling an event
- Depends on database transactions to ensure data consistency

Sacrificing the outstanding scalibility potential of full CQRS gives us the freedom to come up with some other nifty features instead:

- The flux capacitor is very easy to set-up and use
- Using the read model for validation simplifies things a lot!
- Can easily be integrated into existing projects
- Not eventually consistent data, it's consistent data


## Artwork credits

Logo created by [Sergey](https://github.com/Gaserd). Updated and refined by [Jakob Mund](https://twitter.com/jakob_mund). Thank you, guys!

## License

The flux capacitor is released under the terms of the MIT license. See [LICENSE](./LICENSE) for details.
