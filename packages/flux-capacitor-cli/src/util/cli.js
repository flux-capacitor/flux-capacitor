import logSymbols from 'log-symbols'

export {
  highlightFirstLine,
  info,
  step
}

/**
 * @param {string} text
 * @param {Function} highlightFirst   (firstLine: string) => string
 * @param {Function} [highlightOther] (nonFirstLine: string) => string
 * @return {string}
 */
function highlightFirstLine (text, highlightFirst, highlightOther = ident) {
  const [ firstLine, ...otherLines ] = text.split('\n')
  return [ highlightFirst(firstLine), ...otherLines.map(highlightOther) ].join('\n')
}

/**
 * @param {string} message
 * @return {string}
 */
function info (message) {
  return ` ${logSymbols.info} ${message}`
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

function ident (arg) {
  return arg
}
