import userNames from '../fixtures/userNames'

const CHANGE_USERNAME = 'CHANGE_USERNAME'

const randomUserName = userNames[ Math.floor(Math.random() * userNames.length) ]

export default function userNameReducer (userName = randomUserName, action) {
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
