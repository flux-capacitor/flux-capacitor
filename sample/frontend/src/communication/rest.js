import fetch from 'isomorphic-fetch'

export async function fetchJson (url, options = {}) {
  return await (await fetch(url, options)).json()
}
