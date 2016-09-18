// TODO: Simplify:
// module.exports = createDefaultReducer({ notesAdded, noteTitleEdited, ... })

function notesReducer (collection, event) {
  switch (event.type) {
    case 'noteAdded':
      return noteAdded(collection, event)
    case 'noteTitleEdited':
      return noteTitleEdited(collection, event)
    case 'noteContentEdited':
      return noteContentEdited(collection, event)
    case 'noteRemoved':
      return noteRemoved(collection, event)
    default:
      return collection
  }
}

module.exports = notesReducer

function noteAdded (collection, event) {
  const { id, title, text } = event.payload

  return collection.create({
    id, title, text
  })
}

function noteTitleEdited (collection, event) {
  const { id, title } = event.payload

  return collection.updateById(id, { title })
}

function noteContentEdited (collection, event) {
  const { id, text } = event.payload

  return collection.update({ text }, { whereId: id })
}

function noteRemoved (collection, event) {
  const { id } = event.payload

  return collection.destroyById(id)
}
