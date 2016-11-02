'use strict'

/**
 * Extends sequelize transaction.
 *
 * @param {Database} database
 * @param {Sequelize.Transaction} sequelizeTransaction
 * @return {Transaction}
 */
function createTransaction (database, sequelizeTransaction) {
  const transaction = Object.assign(sequelizeTransaction, {
    getImplementation () {
      return sequelizeTransaction
    },

    perform (changeset) {
      return database.applyChangeset(changeset, { transaction })
    }
  })
  return transaction
}

module.exports = createTransaction
