const { applyMiddleware, compose } = require('redux')
const aggregateReducers = require('./aggregateReducers')
const createStore = require('./createStore')
const eventLogReducer = require('./eventLogReducer')

module.exports = {
  aggregateReducers,
  applyMiddleware,
  compose,
  createStore,
  eventLogReducer
}
