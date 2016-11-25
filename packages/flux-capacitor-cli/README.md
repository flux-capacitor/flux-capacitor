# Flux Capacitor - CLI

[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![NPM Version](https://img.shields.io/npm/v/flux-capacitor-cli.svg)](https://www.npmjs.com/package/flux-capacitor-cli)

Command line interface (CLI) tool for the [Flux Capacitor](https://github.com/flux-capacitor/flux-capacitor). Utility to set up, administrate and debug flux capacitor stores.


## Usage

```sh
# Set up a new flux capacitor instance
flux init [<target directory>] [--database <connection url>]

# Print event count, most recent event timestamp
flux status

# Dispatch an event
flux dispatch <event type | complete JSON event> [--payload <JSON payload>] [--meta <JSON meta>] [--raw]

# Show event log
flux log [[<event id>]..[<event id>]] [--count <int>] [--raw]

# Show some event
flux show <event id> [--raw]

# Show some collection or collection instance
flux show /<collection>[/<id>] [--raw]

# Run SQL query or open REPL (if no query passed)
flux query [<SQL query>] [--raw]
```


## Flux Capacitor

Find it here 👉 [Flux Capacitor](https://github.com/flux-capacitor/flux-capacitor)


## License

Released under the terms of the MIT license.
