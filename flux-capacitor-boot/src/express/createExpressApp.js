const bodyParser = require('body-parser')
const express = require('express')
const helmet = require('helmet')

module.exports = createExpressApp

function createExpressApp () {
  const app = express()

  app.use(helmet())
  app.use(bodyParser.json())

  return app
}
