import mkdirp from 'mkdirp-promise'
import exists from 'path-exists'
import path from 'path'
import uniq from 'uniq'
import { recursiveFileList } from '../util/fs'

export default init

async function init (options, args) {
  const defaultDatabase = 'sqlite://db.sqlite'
  const { database = defaultDatabase } = options

  if (args.length > 0) {
    throw new Error(`Expected no arguments.`)
  }
  if (!('database' in options)) {
    console.log(`No --database passed. Using default: ${defaultDatabase}\n`)
  }
  if (Array.isArray(database)) {
    throw new Error(`Only one database connection URL allowed.`)
  }

  const files = await recursiveFileList(path.resolve(__dirname, '..', '..', 'template'))

  await assertFilesCanBeCopied(files)
  console.log('Files:', files)

  // TODO: Copy template
  // TODO: Add `flux` to package.json
  // TODO: npm install --save (don't forget DB driver)
}

async function assertFilesCanBeCopied (filePaths) {
  const topLevelFileDirNames = uniq(filePaths
    .map((filePath) => filePath.split(path.sep).shift())
  )

  await Promise.all(
    topLevelFileDirNames.map((fileName) => assertExistsNot(fileName))
  )
}

async function assertExistsNot (filePath) {
  if (await exists(filePath)) {
    throw new Error(`File/directory already exists: ${filePath}`)
  }
}

// TODO: Can this be removed?
async function distinctDirPaths (filePaths) {
  const dirPaths = filePaths
    .map((filePath) => path.dirname(filePath))
    .filter((dirPath) => dirPath !== '.')

  return uniq(dirPaths)
}
