# Flux Capacitor - CLI

[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![NPM Version](https://img.shields.io/npm/v/flux-capacitor-cli.svg)](https://www.npmjs.com/package/flux-capacitor-cli)

Command line interface (CLI) tool for the [Flux Capacitor](https://github.com/flux-capacitor/flux-capacitor). Utility to set up, administrate and debug flux capacitor stores.


## Usage

```sh
flux init [--database <connection url>]     # writes boiler-plate code, npm installs (incl. db driver), adds/extends package.json, adds/extends .env file
flux status                                 # prints event count, oldest & youngest event timestamp, snapshot count, last full & last incr snapshot timestamp
flux dispatch <event type | complete JSON event> [--payload <JSON payload>] [--meta <JSON meta>]
flux log [[<event id>]..[<event id>]] [--count <int>]
flux query [<SQL query>]                    # also very useful for demoing (showing what's in the DB); starts REPL if no SQL query given
flux show <event id>
flux show /<collection>[/<id>]
```


## Flux Capacitor

Find it here 👉 [Flux Capacitor](https://github.com/flux-capacitor/flux-capacitor)


## License

Released under the terms of the MIT license.
