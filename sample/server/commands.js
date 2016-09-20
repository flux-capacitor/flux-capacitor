/**
 * This file contains the command handlers. They take command data included in
 * the HTTP request and return an event that will be dispatched. You could also
 * dispatch multiple events at once.
 */

const commandHandlers = {
  addNote,
  editNoteTitle,
  editNoteContent,
  removeNote
}

function runCommand (name, meta, payload) {
  if (name in commandHandlers) {
    const handler = commandHandlers[ name ]
    const event = handler(payload, meta)

    return event
  } else {
    throw new Error(`Unknown command: ${name}`)
  }
}

exports.runCommand = runCommand

function addNote ({ id, title, text }, meta) {
  return {
    type: 'noteAdded',
    payload: {
      id, title, text
    },
    meta
  }
}

function editNoteTitle ({ id, title }, meta) {
  return {
    type: 'noteTitleEdited',
    payload: {
      id, title
    },
    meta
  }
}

function editNoteContent ({ id, text }, meta) {
  return {
    type: 'noteContentEdited',
    payload: {
      id, text
    },
    meta
  }
}

function removeNote ({ id }, meta) {
  return {
    type: 'noteRemoved',
    payload: {
      id
    },
    meta
  }
}
