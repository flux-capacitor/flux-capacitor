module.exports = bootstrap

/**
 * Takes an array of bootstrapping functions and returns a Promise extended by a
 * `listen` method.
 *
 * @param {Function[]} bootstrappers
 * @return {FluxCapAppPromise}   { listen: ([port: int][, hostname: string]) => Promise<Http.Server>, catch: (Error) => Promise, then: (Function) => Promise }
 */
function bootstrap (bootstrappers) {
  const bootstrapPromise = bootstrappers.reduce(
    (metaPromise, bootstrapper) => metaPromise.then((prevMeta) =>
      Promise.resolve(bootstrapper(prevMeta)).then((newMeta) => Object.assign({}, prevMeta, newMeta))
    ),
    Promise.resolve({})
  ).then((meta) => checkIfReadyToBoot(meta))

  /**
   * @param {int}    [port]
   * @param {string} [hostname]
   * @return {Promise<Http.Server>}
   * @see https://nodejs.org/api/http.html#http_server_listen_port_hostname_backlog_callback
   */
  bootstrapPromise.listen = function listen (port, hostname) {
    return bootstrapPromise.then((meta) => promisifiedListen(meta.app, port, hostname))
  }

  return bootstrapPromise
}

function checkIfReadyToBoot (meta) {
  const { app, store } = meta

  if (!app) {
    throw new Error(`bootstrap(): No express app set.`)
  }
  if (!store) {
    throw new Error(`bootstrap(): No flux capacitor store set.`)
  }

  return meta
}

function promisifiedListen (app, port, hostname) {
  return new Promise((resolve, reject) => {
    const server = app.listen(port || 0, hostname, () => {
      const address = server.address()
      console.log(`⚛ Flux Capacitor running on ${address.address}:${address.port}...`)
      resolve(server)
    })

    server.once('error', (error) => reject(error))
  })
}
