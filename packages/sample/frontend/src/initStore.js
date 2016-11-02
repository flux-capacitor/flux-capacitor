import { createStore, applyMiddleware, combineReducers, compose } from 'redux'
import ReduxThunk from 'redux-thunk'
import * as reducers from './ducks'

export default function initStore () {
  const rootReducer = combineReducers(reducers)

  const enhancer = compose(
    applyMiddleware(ReduxThunk),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )
  return createStore(rootReducer, enhancer)
}
