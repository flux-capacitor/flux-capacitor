import fs from 'mz/fs'
import { copy } from 'fs-extra'
import { update as updateJson } from 'json-update'
import mkdirp from 'mkdirp-promise'
import exists from 'path-exists'
import path from 'path'
import uniq from 'uniq'
import { locatePackageJson, recursiveFileList } from '../util/fs'

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

  const destPath = process.cwd()
  const templatePath = path.resolve(__dirname, '..', '..', 'template')
  const files = await recursiveFileList(templatePath)
  const packageJsonPath = await locateOrCreatePackageJson()

  await assertFilesCanBeCopied(files)
  await copyTemplate(templatePath, files, destPath)
  await patchPackageJson(packageJsonPath, path.join(destPath, 'store.js'))

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

async function locateOrCreatePackageJson () {
  try {
    const filePath = await locatePackageJson()
    console.log(`Found package.json: ${filePath}`)
    return filePath
  } catch (error) {
    const filePath = 'package.json'
    console.log(`Creating empty ${filePath}...`)
    await fs.writeFile(filePath, '{}\n')
    return filePath
  }
}

async function patchPackageJson (filePath, storeJsPath) {
  return await updateJson(filePath, {
    flux: {
      store: path.relative(path.dirname(filePath), storeJsPath)
    }
  })
}

async function copyTemplate (templatePath, files, destPath) {
  return await Promise.all(
    files.map((relativeFilePath) => copyFile(
      path.join(templatePath, relativeFilePath),
      path.join(destPath, relativeFilePath)
    ))
  )
}

function copyFile (from, to) {
  return new Promise((resolve, reject) => {
    copy(from, to, (error) => {
      error ? reject(error) : resolve()
    })
  })
}
