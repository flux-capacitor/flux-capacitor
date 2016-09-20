/**
 * This file contains all the REST communication logic.
 * It's the ears and the mouth of the store.
 *
 * POST to `/command/<command name>` with the command payload in the request
 * body (JSON-encoded) to dispatch a command. The response will contain the
 * events created.
 *
 * TODO: Provide this basic REST communication layer out-of-the-box with the lib.
 *       Very simple to use: Just init an express app, pass `app`, `dispatch` and
 *       `store` to the lib's REST server bootstrapper. Done!
 */

const express = require('express')
const { runCommand } = require('./commands')

function initRestApi (store) {
  const router = express.Router()

  initDispatchingRoutes(router, store)
  initRetrievalRoutes(router, store.getDatabase())

  return router
}

exports.initRestApi = initRestApi

function initDispatchingRoutes (router, store) {
  router.use('/command', checkAuthentication)

  router.post('/command/:command', asyncHandler(async (req, res) => {
    const { user } = req.query
    const event = runCommand(req.params.command, { user }, req.body)

    // Could also dispatch an array of events here
    // Returned events equal the dispatched events, but an event ID will have been added
    const processedEvents = await store.dispatch(event)

    res.json(processedEvents)
  }))
}

function initRetrievalRoutes (router, database) {
  const { Events, Notes } = database.collections

  const exportEvent = (event) => {
    const eventJson = event.toJSON()
    return Object.assign({}, eventJson, {
      meta: JSON.parse(eventJson.meta),
      payload: JSON.parse(eventJson.payload)
    })
  }

  router.get('/events', createCollectionFindAllHandler(Events, exportEvent))
  router.get('/notes', createCollectionFindAllHandler(Notes))
}

function checkAuthentication (req, res, next) {
  const { user } = req.query

  if (!user) {
    next(new Error('No user set. You need to authenticate.'))
  } else {
    next()
  }
}

function createCollectionFindAllHandler (collection, exportItem = (item) => item) {
  return asyncHandler(async (req, res) => {
    const options = createRetrievalOptions(req.query)
    const items = await collection.findAll(options)

    res.set('Cache-Control', 'no-cache')
    res.json(
      items.map((item) => exportItem(item))
    )
  })
}

function asyncHandler (handler) {
  return (req, res, next) => {
    handler(req, res)
      .then(() => next())
      .catch((error) => next(error))
  }
}

function createRetrievalOptions ({ limit, order }) {
  return Object.assign(
    {},
    limit && { limit },
    order && { order: [[ 'id', order ]] }
  )
}
