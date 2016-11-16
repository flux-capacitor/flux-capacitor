import test from 'ava'
import fs from 'mz/fs'
import path from 'path'
import { locatePackageJson, recursiveFileList } from '../fs'

test('recursiveFileList()', async (t) => {
  const files = await recursiveFileList(path.resolve(__dirname, 'fixtures', 'template'))

  t.deepEqual(files, [
    'index.js', 'foo/bar.js', 'foo/baz.txt'
  ])
})

test('locatePackageJson() works', async (t) => {
  const expectedPath = fs.realpathSync(path.resolve(__dirname, '..', '..', '..', 'package.json'))

  t.is(await locatePackageJson(), expectedPath)
})

test('locatePackageJson("/") fails properly', async (t) => {
  t.throws(locatePackageJson('/'), 'package.json file not found.')
})

test('locatePackageJson("/") fails properly', async (t) => {
  await t.throws(locatePackageJson('/'), 'package.json file not found.')
})

test('locatePackageJson("/tmp") fails properly', async (t) => {
  await t.throws(locatePackageJson('/tmp'), 'package.json file not found.')
})
