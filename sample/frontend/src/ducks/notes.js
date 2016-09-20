import { fetchJson } from '../communication/rest'
import reduxify from '../../../../lib/reduxify'
import backendNotesReducer from '../../../reducers/notes'

const NOTES_LOADED = 'NOTES_LOADED'
const CREATE_NOTE = 'CREATE_NOTE'
const REMOVE_UNSAVED_NOTE = 'REMOVE_UNSAVED_NOTE'

const reduxifiedReducer = reduxify(backendNotesReducer)

export default function notesReducer (notes = [], action) {
  switch (action.type) {
    case NOTES_LOADED:
      return action.payload

    case CREATE_NOTE:
      return [ action.payload ].concat(notes)

    case REMOVE_UNSAVED_NOTE:
      return notes.filter((note) => !!note.id)

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
      title: '',
      text: ''
    }
  }
}

export function removeUnsavedNote () {
  return {
    type: REMOVE_UNSAVED_NOTE
  }
}
