'use strict'

const redux = require('redux')
const aggregateReducers = require('./aggregateReducers')
const createStore = require('./createStore')
const eventLogReducer = require('./eventLogReducer')

module.exports = {
  aggregateReducers,
  applyMiddleware: redux.applyMiddleware,
  compose: redux.compose,
  createStore,
  eventLogReducer
}
