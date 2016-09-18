const notesReducer = require('./notes')

module.exports = function rootReducer (database, event) {
  const { Notes } = database.collections

  return notesReducer(Notes, event)
}
