const Sequelize = require('sequelize')
const createCollection = require('flux-capacitor-sequelize').createCollection

module.exports = createNotesModel

const model = {
  id: {
    type: Sequelize.STRING,
    primaryKey: true,
    allowNull: false
  },
  createdAt: {
    type: Sequelize.DATE,
    allowNull: false
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  text: {
    type: Sequelize.TEXT,
    allowNull: false
  }
}

const indexes = [
  {
    fields: [ 'title' ]
  }
]

function createNotesModel (sequelize) {
  const noteModel = sequelize.define('note', model, {
    indexes,
    timestamps: false
  })
  return createCollection('Notes', noteModel)
}
