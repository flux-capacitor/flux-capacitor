import fetch from 'isomorphic-fetch'
import notie from 'notie'

export async function fetchJson (url, options = {}) {
  try {
    return await (await fetch(url, options)).json()
  } catch (error) {
    showError(error)
    throw error
  }
}

export async function postJson (url, payload) {
  const fetchOptions = {
    method: 'post',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json'
    }
  }

  try {
    return await (await fetch(url, fetchOptions)).json()
  } catch (error) {
    showError(error)
    throw error
  }
}

function showError (error) {
  notie.alert('error', error.message, 4)
}
