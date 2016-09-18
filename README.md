
- Redux for the backend, means event-based data storage
- Highlight little code necessary, works like redux
- Push notifications and great opportunities for analytics for free
- Use same code in frontend and backend (for push notifications)
- Everything is functional and loosely-coupled
- Works with PostgreSQL, MySQL, SQLite & MSSQL using Sequelize right now
- But virtually any database is possible (but you need transaction support)
- Related to CQRS, but no real CQRS, rather something between common CRUD and real CQRS

- Show flow: Write operation -> DB operations (-> how a rollback happens) -> data retrieval


# OLD:

Data storage service built like redux. Featuring event sourcing, without traditional CQRS (which is both a benefit and a lack).

```
Communication layer (e.g. REST-API-Server)
  (request, response) => command
          ↓
Dispatcher (event creators)
  (command) => Array<event>
          ↓
Begin Transaction, add event to event store
  (database, event) => dbQuery
          ↓
Event handler (reducer)
  (database, event) => dbQuery
          ↓
End transaction, commit or rollback
  (database, event) => dbQuery
          ↓
Back to communication layer (e.g. REST-API-Server)
  (request, response, Array<event>) => response
```


## Concept

- Easily build an event-sourced data store, with a trimmed-down CQRS approach
- Take commands from a random communication layer (REST, MQ, GraphQL, ...)
- Command handlers (equals redux' "action creator") that take a command and create event(s)
- Events are persisted to an event store
- Events are reduced (applied to the read model) by event handlers
- Clean and simple
- Can add redux-like middleware concept


## Difference to real CQRS

- One service, one relational DB
- Scales like classic CRUD approach, not like CQRS :(
- But: No aggregates or intensive command validation necessary :)
  - Instead: Use read model for validating operations
  - Storing the event and updating the read model in one common transaction
  - If applying ("reducing") the event to the read model fails, the event insertion will be rolled back as well
- Plus: No eventual consistency:
  - One DB transaction means you get feedback if operation failed or succeeded


## Additional considerations

- Why not directly use redux?
  - Basically because redux reducers must by synchronous, but database access is asynchronous
  - Could still use redux for tracking recent event creation, event denormalization
    - But: Would have to clean the redux action log periodically, since it will grow very fast
    - Might be good for debugging the data store code base, but apart from that not much useful



- Event log / event stream are the unique feature
- Event log does not necessarily have to be stored in the same database
  - Idea: Store events in monolithic database, but may move oldest events out into another periodically
