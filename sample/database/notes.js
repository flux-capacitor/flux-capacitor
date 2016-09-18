const Sequelize = require('sequelize')

const model = {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
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
  return sequelize.define('note', model, {
    indexes,
    timestamps: false
  })
}

module.exports = createNotesModel
