const eventTypes = require('../constants/events')

module.exports = {
  addNote,
  editNoteTitle,
  editNoteContent,
  removeNote
}

function addNote ({ id, title, text }, meta) {
  return {
    type: eventTypes.noteAdded,
    payload: {
      id, title, text, createdAt: new Date(Date.now())
    },
    meta
  }
}

function editNoteTitle ({ id, title }, meta) {
  return {
    type: eventTypes.noteTitleEdited,
    payload: {
      id, title
    },
    meta
  }
}

function editNoteContent ({ id, text }, meta) {
  return {
    type: eventTypes.noteContentEdited,
    payload: {
      id, text
    },
    meta
  }
}

function removeNote ({ id }, meta) {
  return {
    type: eventTypes.noteRemoved,
    payload: {
      id
    },
    meta
  }
}
