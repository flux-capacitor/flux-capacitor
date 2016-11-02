# Flux Capacitor - Sample App

### Run the sample app

```sh
cd sample/
npm start
```

### Rebuild the sample app frontend

```sh
cd sample/frontend/
npm run build
```

### Run the dev server when working on the frontend

```sh
cd sample/frontend/
npm run start
```

And in another terminal run the sample server:

```sh
cd sample/server/
npm start
```

### Run the tests

```sh
cd sample/      # to run the tests for sample app and server
npm test
```

### Deploy

```sh
cd sample/frontend
npm run build

cd ../server
npm run deploy

# To let https://flux-capacitor-notes.now.sh/ point to the new deployment
now alias set <deployment-id> flux-capacitor-notes
```

## License

The sample app if released under the terms of the MIT license as well.
