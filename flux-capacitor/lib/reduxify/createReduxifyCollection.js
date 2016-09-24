function createReduxifyCollection (state, name = null) {
  return {
    name,

    create (values) {
      return (state) => state.concat([ values ])
    },

    updateById (id, values) {
      return (state) => {
        const itemIndex = state.findIndex((itemIt) => (itemIt.id === id))
        return itemIndex >= 0
          ? replaceArrayItem(state, itemIndex, Object.assign({}, state[ itemIndex ], values))
          : state
      }
    },

    destroyById (id) {
      return (state) => {
        const itemIndex = state.findIndex((itemIt) => (itemIt.id === id))
        return itemIndex >= 0
          ? removeArrayItem(state, itemIndex)
          : state
      }
    },

    /**
     * Do nothing. Useful to explicitly return an empty no-change changeset.
     */
    noChange () {
      return (state) => state
    }
  }
}

module.exports = createReduxifyCollection

function replaceArrayItem (array, index, newItem) {
  const itemsBefore = array.slice(0, index)
  const itemsAfter = array.slice(index + 1)

  return itemsBefore.concat([ newItem ]).concat(itemsAfter)
}

function removeArrayItem (array, index) {
  const itemsBefore = array.slice(0, index)
  const itemsAfter = array.slice(index + 1)

  return itemsBefore.concat(itemsAfter)
}
