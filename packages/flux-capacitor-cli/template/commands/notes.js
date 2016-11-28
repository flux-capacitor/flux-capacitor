const eventTypes = require('../constants/events')

module.exports = {
  addNote,
  editNoteTitle,
  editNoteContent,
  removeNote
}

function addNote (payload, meta) {
  return {
    type: eventTypes.noteAdded,
    payload: {
      id: payload.id,
      title: payload.title,
      text: payload.text,
      createdAt: new Date(Date.now())
    },
    meta
  }
}

function editNoteTitle (payload, meta) {
  return {
    type: eventTypes.noteTitleEdited,
    payload: {
      id: payload.id,
      title: payload.title
    },
    meta
  }
}

function editNoteContent (payload, meta) {
  return {
    type: eventTypes.noteContentEdited,
    payload: {
      id: payload.id,
      text: payload.text
    },
    meta
  }
}

function removeNote (payload, meta) {
  return {
    type: eventTypes.noteRemoved,
    payload: {
      id: payload.id
    },
    meta
  }
}
