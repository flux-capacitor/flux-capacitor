import { fetchJson, postJson } from '../communication/rest'
import reduxify from 'flux-capacitor-reduxify'
import uuid from 'uuid'
import backendNotesReducer from '!babel!../../../server/reducers/notes'

const NOTES_LOADED = 'NOTES_LOADED'
const CREATE_NOTE = 'CREATE_NOTE'
const SAVE_NEW_NOTE = 'SAVE_NEW_NOTE'
const REMOVE_UNSAVED_NOTE = 'REMOVE_UNSAVED_NOTE'

const reduxifiedReducer = reduxify(backendNotesReducer)

export default function notesReducer (notes = [], action) {
  switch (action.type) {
    case NOTES_LOADED:
      return action.payload

    case CREATE_NOTE:
      return [ action.payload ].concat(notes)

    case SAVE_NEW_NOTE:
      const note = action.payload
      const otherNotes = notes.filter((noteIt) => (noteIt.id !== note.id))
      return [ note ].concat(otherNotes)

    case REMOVE_UNSAVED_NOTE:
      return notes.filter((note) => !!note.createdAt)

    default:
      return reduxifiedReducer(notes, action)
  }
}

export function loadNotes (url) {
  return async (dispatch) => {
    const json = await fetchJson(url)

    dispatch({
      type: NOTES_LOADED,
      payload: json
    })
  }
}

export function createNote () {
  return {
    type: CREATE_NOTE,
    payload: {
      id: uuid.v4(),
      createdAt: null,
      title: '',
      text: ''
    }
  }
}

export function saveNewNote (note) {
  return (dispatch, getState) => {
    dispatch({
      type: SAVE_NEW_NOTE,
      payload: note
    })

    const { userName } = getState()
    return postJson(`/api/command/addNote?user=${userName}`, note)
  }
}

export function removeUnsavedNote () {
  return {
    type: REMOVE_UNSAVED_NOTE
  }
}
