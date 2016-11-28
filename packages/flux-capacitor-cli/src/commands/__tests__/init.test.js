import test from 'ava'
import execa from 'execa'
import findPort from 'find-port'
import fs from 'mz/fs'
import os from 'os'
import path from 'path'
import request from 'request-promise'
import temp from 'temp'
import { initInDirectory } from '../init'
import { recursiveFileList } from '../../util/fs'

const TEMPLATE_PATH = path.join(__dirname, '..', '..', '..', 'template')

// Automatically track and cleanup files at exit
temp.track()

test('initializing an empty directory', async (t) => {
  const destPath = await createTempDir()
  const templateFiles = await recursiveFileList(TEMPLATE_PATH)

  await initInDirectory(destPath, 'sqlite://db.sqlite')

  const dotEnvContents = await readFile(path.join(destPath, '.env'))
  t.is(trim(dotEnvContents), trim(`
    DB_CONNECTION=sqlite://db.sqlite
    LISTEN_HOST=0.0.0.0
    LISTEN_PORT=3000
  `))

  const dotGitIgnoreContents = await readFile(path.join(destPath, '.gitignore'))
  t.is(trim(dotGitIgnoreContents), trim(`
    node_modules/
    npm-debug.log
  `))

  const installedPackages = await fs.readdir(path.join(destPath, 'node_modules'))
  const expectedPackages = [
    'dotenv', 'flux-capacitor', 'flux-capacitor-boot', 'flux-capacitor-sequelize', 'sequelize', 'sqlite'
  ]

  expectedPackages.forEach((pkgName) => t.true(installedPackages.indexOf(pkgName) > -1))

  const pkg = JSON.parse(await readFile(path.join(destPath, 'package.json')))
  t.deepEqual(pkg.flux, { store: 'store.js' })
  t.deepEqual(pkg.scripts, { start: 'node server.js' })
  t.deepEqual(Object.keys(pkg.dependencies), expectedPackages)

  await Promise.all(templateFiles.map(async (relativeFilePath) => {
    const srcFilePath = path.join(TEMPLATE_PATH, relativeFilePath)
    const destFilePath = path.join(destPath, relativeFilePath)

    t.deepEqual(await readFile(srcFilePath), await readFile(destFilePath))
  }))
})

test('initializing a directory containing conflicting files fails properly', async (t) => {
  const destPath = await createTempDir()
  await fs.writeFile(path.join(destPath, '.env'), 'PORT=4000', { encoding: 'utf-8' })

  await t.throws(initInDirectory(destPath, 'sqlite://db.sqlite'), /File\/directory already exists:.*\.env$/)
})

test('initializing an empty directory, then running the server', async (t) => {
  const destPath = await createTempDir()
  const templateFiles = await recursiveFileList(TEMPLATE_PATH)

  await initInDirectory(destPath, 'sqlite://db.sqlite')

  const port = await getAvailablePort()
  await fs.appendFile(path.join(destPath, '.env'), `LISTEN_PORT=${port}\n`)

  const server = execa.shell(`node ./server.js`, { cwd: destPath })
  server.catch((error) => t.fail(error.stack))

  await sleep(1000)

  t.is(await request(`http://localhost:${port}/events`), '[]')
  t.is(await request(`http://localhost:${port}/notes`), '[]')

  // no need to kill process, execa takes care (https://github.com/sindresorhus/execa#cleanup)
})

async function createTempDir () {
  return new Promise((resolve, reject) => {
    temp.mkdir('flux-cli-test-', (error, dirPath) => (error ? reject(error) : resolve(dirPath)))
  })
}

async function getAvailablePort () {
  return await new Promise((resolve, reject) => {
    findPort('127.0.0.1', [ 8000, 9000 ], (ports) => {
      if (ports.length === 0) {
        reject(new Error(`No available port found.`))
      } else {
        resolve(ports[0])
      }
    })
  })
}

async function post (uri, body) {
  return await request({
    uri, body, method: 'POST', json: true
  })
}

async function readFile (filePath) {
  return await fs.readFile(filePath, { encoding: 'utf-8' })
}

async function sleep (ms) {
  await new Promise((resolve) => {
    setTimeout(() => resolve(), ms)
  })
}

function trim (string) {
  return string.split('\n')
    .map((partial) => partial.trim())
    .join('\n')
    .trim()
}
