# API Concept

## Goals

- Write command and event handlers similarly to redux action creators / reducers
- Two ways of using / building the data store service:
  - Write app that uses the lib
  - Launch lib with communication layer module (configurable default REST server implementation) and handlers
- Try being able to use same reducers in frontend & backend
  - Not only important for the websockets use case, but also for REST-API-only:
  - So the events in the response body can be applied to the client's data


## Isomorphic reducing

(Frontend)
```js
import { createEventReducer, reduceEvent } from 'somewhere...'

export function handleUserEvents (state = [], action) {
  switch (action.type) {
    case 'event/userAdded':
      return reduceEvent(state, action.payload, userAddedBackendHandler)
    default:
      return state
  }
}

// - or -

export const handleUserEvents = createEventReducer([], [
  userAddedBackendHandler
])
```
