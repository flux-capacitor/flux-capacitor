/**
 * Event model definition. Specifies the data model of the event log.
 */

const Sequelize = require('sequelize')

const model = {
  ///////////////////////
  // Generic properties:

  id: {
    type: Sequelize.UUID,
    primaryKey: true
  },
  type: {
    type: Sequelize.STRING,
    allowNull: false
  },
  payload: Sequelize.JSON,
  meta: Sequelize.JSON,

  //////////////////////
  // Custom properties:

  user: {
    type: Sequelize.STRING,
    allowNull: false
  }
}

const indexes = [
  {
    fields: [ 'type' ]
  }, {
    fields: [ 'user' ]
  }
]

const hooks = {
  // Use Sequelize's beforeValidate hook to automatically set the user property
  beforeValidate: (event) => {
    const meta = event.getDataValue('meta')

    if (meta && meta.user) {
      event.setDataValue('user', meta.user)
    }
  }
}

function createEventsModel (sequelize) {
  return sequelize.define('event', model, {
    indexes,
    hooks,
    timestamps: false
  })
}

module.exports = createEventsModel
