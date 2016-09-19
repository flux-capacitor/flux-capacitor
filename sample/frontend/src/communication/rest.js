import fetch from 'isomorphic-fetch'

export async function fetchJson (url, options = {}) {
  return await (await fetch(url, options)).json()
}

export async function postJson (url, payload) {
  const fetchOptions = {
    method: 'post',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json'
    }
  }
  return await (await fetch(url, fetchOptions)).json()
}
