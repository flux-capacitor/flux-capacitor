module.exports = useAsyncHandler

/**
 * @param {Function} handler  Promise-based request handler. (Request, Response) => Promise|*
 * @return {Function}         Callback-based request handler. (Request, Response, next: Function) => void
 */
function useAsyncHandler (handler) {
  return (req, res, next) => {
    Promise.resolve()
      .then(() => handler(req, res))
      .then(() => next())
      .catch((error) => next(error))
  }
}
