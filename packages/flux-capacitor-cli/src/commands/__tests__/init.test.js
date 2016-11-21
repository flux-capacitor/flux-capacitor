import test from 'ava'
import fs from 'mz/fs'
import os from 'os'
import path from 'path'
import rimraf from 'rimraf-promise'
import { initInDirectory } from '../init'
import { recursiveFileList } from '../../util/fs'

const TEMPLATE_PATH = path.join(__dirname, '..', '..', '..', 'template')

test('initializing an empty directory', async (t) => {
  const destPath = await createTempDir()
  const templateFiles = await recursiveFileList(TEMPLATE_PATH)

  await initInDirectory(destPath, 'sqlite://db.sqlite')

  const dotEnvContents = await readFile(path.join(destPath, '.env'))
  t.is(trim(dotEnvContents), trim(`
    PORT=3000
    DB_CONNECTION=sqlite://db.sqlite
  `))

  const pkg = JSON.parse(await readFile(path.join(destPath, 'package.json')))
  t.deepEqual(pkg.flux, { store: 'store.js' })
  t.deepEqual(pkg.scripts, { start: 'node server.js' })
  t.deepEqual(Object.keys(pkg.dependencies), [
    'dotenv', 'flux-capacitor', 'flux-capacitor-boot', 'flux-capacitor-sequelize', 'sqlite'
  ])

  await Promise.all(templateFiles.map(async (relativeFilePath) => {
    const srcFilePath = path.join(TEMPLATE_PATH, relativeFilePath)
    const destFilePath = path.join(destPath, relativeFilePath)

    t.deepEqual(await readFile(srcFilePath), await readFile(destFilePath))
  }))

  await rimraf(destPath)
})

test('initializing a directory containing conflicting files fails properly', async (t) => {
  const destPath = await createTempDir()
  await fs.writeFile(path.join(destPath, '.env'), 'PORT=4000', { encoding: 'utf-8' })

  await t.throws(initInDirectory(destPath, 'sqlite://db.sqlite'), /File\/directory already exists:.*\.env$/)
  await rimraf(destPath)
})

async function createTempDir () {
  return await fs.mkdtemp(path.join(os.tmpdir(), 'flux-cli-test-'))
}

async function readFile (filePath) {
  return await fs.readFile(filePath, { encoding: 'utf-8' })
}

function trim (string) {
  return string.split('\n')
    .map((partial) => partial.trim())
    .join('\n')
    .trim()
}
