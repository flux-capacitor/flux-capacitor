const CHANGE_USERNAME = 'CHANGE_USERNAME'

export default function userNameReducer (userName = '', action) {
  switch (action.type) {
    case CHANGE_USERNAME:
      return action.payload
    default:
      return userName
  }
}

export function changeUserName (userName) {
  return {
    type: CHANGE_USERNAME,
    payload: userName
  }
}
