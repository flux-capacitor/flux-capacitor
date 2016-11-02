const expressWS = require('express-ws')

function initWebsocketServer (app, store) {
  const path = '/websocket'

  expressWS(app)

  app.ws(path, (socket) => {
    const unsubscribe = store.subscribe((events) => {
      socket.send(JSON.stringify(events))
    })

    socket.on('close', () => unsubscribe())
  })
  console.log(`Web socket available on path: ${path}`)
}

exports.initWebsocketServer = initWebsocketServer
