const eventTypes = require('../constants/events')

module.exports = notesReducer

function notesReducer (Notes, event) {
  switch (event.type) {
    case eventTypes.noteAdded:
      return noteAdded(Notes, event)
    case eventTypes.noteTitleEdited:
      return noteTitleEdited(Notes, event)
    case eventTypes.noteContentEdited:
      return noteContentEdited(Notes, event)
    case eventTypes.noteRemoved:
      return noteRemoved(Notes, event)
    default:
      return Notes.noChange()
  }
}

function noteAdded (collection, event) {
  const id = event.payload.id
  const createdAt = event.payload.createdAt
  const title = event.payload.title
  const text = event.payload.text

  return collection.create({
    id, createdAt, title, text
  })
}

function noteTitleEdited (collection, event) {
  const id = event.payload.id
  const title = event.payload.title

  return collection.updateById(id, { title })
}

function noteContentEdited (collection, event) {
  const id = event.payload.id
  const text = event.payload.text

  return collection.updateById(id, { text })
}

function noteRemoved (collection, event) {
  const id = event.payload.id

  return collection.destroyById(id)
}
