import { fetchJson } from '../communication/rest'

const NOTES_LOADED = 'NOTES_LOADED'

export default function notesReducer (notes = [], action) {
  switch (action.type) {
    case NOTES_LOADED:
      return action.payload

    default:
      return notes
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
