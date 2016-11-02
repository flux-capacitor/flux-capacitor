const RAWVIEW_SHOW = 'RAWVIEW_SHOW'
const RAWVIEW_HIDE = 'RAWVIEW_HIDE'

export default function rawViewReducer (state = null, action) {
  switch (action.type) {
    case RAWVIEW_SHOW:
      return action.payload
    case RAWVIEW_HIDE:
      return null
    default:
      return state
  }
}

export function show (title, content) {
  return {
    type: RAWVIEW_SHOW,
    payload: {
      title, content
    }
  }
}

export function hide () {
  return {
    type: RAWVIEW_HIDE
  }
}
