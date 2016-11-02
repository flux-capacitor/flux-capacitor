import fetch from 'isomorphic-fetch'
import notie from 'notie'

export async function fetchJson (url, options = {}) {
  try {
    return await parseJsonResponse(await fetch(url, options))
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
    return await parseJsonResponse(await fetch(url, fetchOptions))
  } catch (error) {
    showError(error)
    throw error
  }
}

async function parseJsonResponse (response) {
  const contentType = response.headers.get('Content-Type')

  if (contentType && contentType.match(/json/)) {
    return await response.json()
  } else {
    throw new Error(await response.text())
  }
}

function showError (error) {
  notie.alert('error', error.message, 4)
}
