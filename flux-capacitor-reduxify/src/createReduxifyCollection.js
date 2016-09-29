export default createReduxifyCollection

function createReduxifyCollection (state, name = null) {
  return {
    name,

    create (values) {
      return (state) => {
        const existingItem = values.id && state.find(byId(values.id))
        const updateItem = (itemIt) => (
          itemIt.id === existingItem.id
            ? Object.assign({}, existingItem, values)
            : itemIt
        )

        return existingItem
          ? state.map(updateItem)
          : state.concat([ values ])
      }
    },

    updateById (id, values) {
      return (state) => {
        const itemIndex = state.findIndex(byId(id))
        return itemIndex >= 0
          ? replaceArrayItem(state, itemIndex, Object.assign({}, state[ itemIndex ], values))
          : state
      }
    },

    destroyById (id) {
      return (state) => {
        const itemIndex = state.findIndex(byId(id))
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

function byId (id) {
  return (item) => (item.id === id)
}
