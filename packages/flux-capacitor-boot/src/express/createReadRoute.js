const assert = require('assert')
const useAsyncHandler = require('./util/useAsyncHandler')

module.exports = createReadRoute

// @TODO: `createReadRoute()` => `createReadRoutes()`
// @TODO: make `createReadRoute()` use `createReadRoutes()`

/**
 * @param {string}   collectionName       Name of a database collection
 * @param {object}   [options]
 * @param {Function} [options.exportItem] (object) => object
 * @param {string}   [options.sortBy]     Sort by this field if not specified by query params
 * @param {string}   [options.sortOrder]  Sort `ASC` or `DESC` if not specified by query params
 * @return {Function}                     (Express.Route, bootstrapped: Object) => Express.Route
 */
function createReadRoute (collectionName, options) {
  /**
   * @param {Express.Route} route       Path may or may not contain an `:id` (alias `:entityId`) route param.
   * @param {Object} bootstrapped       Internal state of `bootstrap()`.
   * @param {Store}  bootstrapped.store Flux capacitor store.
   * @return {Express.Route}
   */
  return function setUpRetrievalRoute (route, { store }) {
    assert(store, `createReadRoute(): No store set yet. Use 'use.store()' before.`)

    const { collections } = store.getDatabase()
    const collection = collections[ collectionName ]
    assert(collection,
      `createReadRoute(): Collection '${collectionName}' not found. Did you set up this collection in your code?`
    )

    const readHandler = createReadHandler(collection, options)
    return route.get(useAsyncHandler(readHandler))
  }
}

/**
 * @param {Collection} collection     Flux capacitor collection
 * @param {object} [options]          See createReadRoute()
 * @return {Function}                 (Request, Response) => Promise
 */
function createReadHandler (collection, options) {
  const { fields } = collection
  const defaultOptions = {
    exportItem: (item) => item,
    sortBy: 'createdAt' in fields ? 'createdAt' : null,
    sortOrder: 'ASC'
  }
  options = Object.assign({}, defaultOptions, options)

  return function readHandler (req, res) {
    if (hasEntityId(req)) {
      return collection.findById(getEntityId(req))
        .then((item) => {
          res.set('Cache-Control', 'no-cache')
          res.json(options.exportItem(item))
        })
    } else {
      const queryOptions = createQueryOptions(req, options)
      return collection.findAll(queryOptions)
        .then((items) => {
          res.set('Cache-Control', 'no-cache')
          res.json(items.map(options.exportItem))
        })
    }
  }
}

function createQueryOptions (req, options) {
  const { limit, offset, order } = req.query

  return Object.assign(
    {},
    limit ? { limit: parseInt(limit) } : {},
    offset ? { offset: parseInt(offset) } : {},
    order ? { order: [[ options.sortBy, order || options.sortOrder ]] } : {}
  )
}

/**
 * @param {Request} req
 * @return {string}
 */
function getEntityId (req) {
  return req.params.entityId || req.params.id
}

/**
 * @param {Request} req
 * @return {boolean}
 */
function hasEntityId (req) {
  return Boolean(getEntityId(req))
}
