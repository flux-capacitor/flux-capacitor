export {
  info,
  step
}

function info (message) {
  console.log(` ℹ️ ${message}`)
}

/**
 * @param {string} title
 * @param {function} task
 */
function step (title, task) {
  return {
    title,
    task
  }
}
