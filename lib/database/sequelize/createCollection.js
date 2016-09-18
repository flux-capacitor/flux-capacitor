const createChangeset = require('../createChangeset')

function createCollection (name, model) {
  const collection = {
    name,

    ////////////
    // Queries:

    findAll (options) {
      return model.findAll(options)
    },

    findById (id) {
      return model.findById(options)
    },

    findOne (options) {
      return model.findOne(options)
    },

    ///////////////////////
    // Changeset creators:

    create (values, options) {
      return createBoundChangeset((transaction) => {
        options = Object.assign({}, options, setTransaction(transaction))
        return model.create(values, options)
      })
    },

    updateById (id, values, options) {
      return createBoundChangeset((transaction) => {
        options = Object.assign({}, options, setId(id), setLimit(1), setTransaction(transaction))
        return model.update(values, options)
      })
    },

    destroyById (id, options) {
      return createBoundChangeset((transaction) => {
        options = Object.assign({}, options, setId(id), setLimit(1), setTransaction(transaction))
        return model.destroy(options)
      })
    }
  }

  return collection

  function createBoundChangeset (action) {
    return createChangeset(action, { collection })
  }
}

module.exports = createCollection

function setId (id) {
  return {
    where: { id }
  }
}

function setLimit (maxRows) {
  return {
    limit: maxRows
  }
}

function setTransaction (transaction) {
  return {
    transaction: transaction.getImplementation()
  }
}
