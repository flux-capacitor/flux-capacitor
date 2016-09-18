import { fetchJson } from '../communication/rest'

const EVENTS_LOADED = 'EVENTS_LOADED'

export default function eventsReducer (notes = [], action) {
  switch (action.type) {
    case EVENTS_LOADED:
      return action.payload

    default:
      return notes
  }
}

export function loadEvents (url) {
  return async (dispatch) => {
    const json = await fetchJson(url)

    dispatch({
      type: EVENTS_LOADED,
      payload: json
    })
  }
}
