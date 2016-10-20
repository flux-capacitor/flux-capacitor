exports.allow = allow
exports.deny = deny

/**
 * Granting access is equal to not throwing an authorization error. So this
 * function does nothing and exists solely for writing fluent, meaningful code.
 *
 * @return void
 */
function allow () { }

/**
 * @param {Error|string} errorOrMessage
 * @throws {Error}
 */
function deny (errorOrMessage) {
  const error = typeof errorOrMessage === 'object' ? errorOrMessage : new Error(errorOrMessage)

  throw Object.assign(error, {
    message: error.message || 'Unauthorized',
    statusCode: error.statusCode || 401
  })
}
