/**
 * @param {Function}   action     Some function that performs the actual operation(s).
 * @param {object}     [meta]
 * @param {Collection} [meta.collection]
 * @return {Changeset}
 */
function createChangeset (action, meta) {
  const errorHandler = meta && meta.collection && meta.collection.name
    ? (error) => { throw Object.assign(error, { message: `Collection ${meta.collection.name}: ${error.message}` }) }
    : (error) => { throw error }

  const changeset = {
    apply () {
      const args = arguments
      return Promise.resolve()
        .then(() => action.apply(null, arguments))
        .catch(errorHandler)
    }
  }

  return Object.assign({}, meta, changeset)
}

module.exports = createChangeset
