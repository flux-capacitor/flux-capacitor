'use strict'

const redux = require('redux')
const combineReducers = require('./combineReducers')
const createStore = require('./createStore')
const eventLogReducer = require('./eventLogReducer')

module.exports = {
  combineReducers,
  applyMiddleware: redux.applyMiddleware,
  compose: redux.compose,
  createStore,
  eventLogReducer
}
