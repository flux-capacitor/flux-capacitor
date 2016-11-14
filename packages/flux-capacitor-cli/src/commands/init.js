import path from 'path'
import { recursiveFileList } from '../util/fs'

export default init

async function init (options, args) {
  const defaultDatabase = 'sqlite://db.sqlite'
  const { database = defaultDatabase } = options

  if (args.length > 0) {
    throw new Error(`Expected no arguments.`)
  }
  if (!('database' in options)) {
    console.log(`No --database passed. Using default: ${defaultDatabase}`)
  }
  if (Array.isArray(database)) {
    throw new Error(`Only one database connection URL allowed.`)
  }

  const files = await recursiveFileList(path.resolve(__dirname, '..', '..', 'template'))
  console.log('Files:', files)

  // TODO: Check that template files can be safely copied / directories created
  // TODO: Copy template
  // TODO: Add `flux` to package.json
  // TODO: npm install --save (don't forget DB driver)
}
