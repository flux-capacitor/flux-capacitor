# Flux Capacitor - Reduxify

[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

Small utility to turn your [Flux Capacitor](https://github.com/flux-capacitor/flux-capacitor) reducers into Redux reducers, so you can re-use your backend code in your frontend!


## Usage

Here comes some sample code showing how to re-use your flux capacitor reducer in the frontend:

```js
import reduxify from 'flux-capacitor-reduxify'
import { combineReducers } from 'redux'
import backendReducer from './path/to/my/backend/code'

// Note: backendReducer is supposed to take one collection only, not the whole database
// => backendReducer: (Collection, Event) => Changeset
const reduxReducer = reduxify(backendReducer)

const reduxRootReducer = combineReducers({ foo: reduxReducer })
```


## Flux Capacitor

Find it here 👉 [Flux Capacitor](https://github.com/flux-capacitor/flux-capacitor)

## License

Released under the terms of the MIT license.
