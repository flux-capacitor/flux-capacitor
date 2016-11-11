#!/usr/bin/env node

const meow = require('meow')
const commands = require('./commands')

const cli = meow(`
  Usage
    $ flux init [--database=<DB connection URL>]

  Commands
    init        Install a fresh flux capacitor instance in the current directory.
`)

const [ command, args = [] ] = cli.input

if (!command || !commands[ command ]) {
  if (command) {
    console.error(`Unknown command: ${command}`)
  }

  cli.showHelp()
} else {
  const commandMethod = commands[ command ]
  commandMethod(cli.flags, args)
}
