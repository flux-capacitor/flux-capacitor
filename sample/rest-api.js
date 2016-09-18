/**
 * This file contains all the communication logic.
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

const { runCommand } = require('./commands')

function initRestApi (app, database, store) {
  initDispatchingRoutes(app, store)
  initRetrievalRoutes(app, database)
}

function initDispatchingRoutes (app, store) {
  app.use('/command', checkAuthentication)

  app.post('/command/:command', asyncHandler(async (req, res) => {
    const { user } = req.query
    const event = runCommand(req.params.command, { user }, req.body)

    // Could also dispatch an array of events here
    // Returned events equal the dispatched events, but an event ID will have been added
    const processedEvents = await store.dispatch(event)

    res.json(processedEvents)
  }))
}

function initRetrievalRoutes (app, database) {
  const { Events, Notes } = database.collections

  app.get('/events', asyncHandler(async (req, res) => {
    const events = await Events.findAll()
    res.json(events)
  }))

  app.get('/notes', asyncHandler(async (req, res) => {
    const notes = await Notes.findAll()
    res.json(notes)
  }))
}

exports.initRestApi = initRestApi

function checkAuthentication (req, res, next) {
  const { user } = req.query

  if (!user) {
    next(new Error('No user set. You need to authenticate.'))
  } else {
    next()
  }
}

function asyncHandler (handler) {
  return (req, res, next) => {
    handler(req, res)
      .then(() => next())
      .catch((error) => next(error))
  }
}
