import test from 'ava'
import path from 'path'
import { recursiveFileList } from '../fs'

test('recursiveFileList()', async (t) => {
  const files = await recursiveFileList(path.resolve(__dirname, 'fixtures', 'template'))

  t.deepEqual(files, [
    'index.js', 'foo/bar.js', 'foo/baz.txt'
  ])
})
