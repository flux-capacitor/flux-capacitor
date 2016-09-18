const { compose } = require('redux')
const aggregateReducers = require('./aggregateReducers')
const createStore = require('./createStore')
const eventLogReducer = require('./eventLogReducer')

module.exports = {
  aggregateReducers, createStore, compose, eventLogReducer
}
