/*
 * This file exports the root reducer. A reducer is a function that applies an
 * event to the database. It takes the database instance and the event and
 * returns a database manipulation.
 *
 * The root reducer is the aggregation of all single reducers.
 */

const combineReducers = require('flux-capacitor').combineReducers
const eventLogReducer = require('flux-capacitor').eventLogReducer

const notesReducer = require('./notes')

module.exports = combineReducers({
  // [collectionName]: Function
  Events: eventLogReducer,
  Notes: notesReducer
})
