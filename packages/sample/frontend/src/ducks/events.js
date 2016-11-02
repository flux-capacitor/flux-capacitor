import { fetchJson } from '../communication/rest'

const EVENTS_LOADED = 'EVENTS_LOADED'

export default function eventsReducer (events = [], action) {
  switch (action.type) {
    case EVENTS_LOADED:
      return action.payload

    default:
      return isRemoteEvent(action)
        ? addToArrayIfNotYetPresent(events, action)
        : events
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

function addToArrayIfNotYetPresent (array, event) {
  return array.find((eventIt) => eventIt.id === event.id)
    ? array
    : array.concat([ event ])
}

function isRemoteEvent (action) {
  return 'id' in action
}
