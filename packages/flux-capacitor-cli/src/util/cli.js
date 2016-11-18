export {
  step
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
