import deindent from 'deindent'
import execa from 'execa'
import fs from 'mz/fs'
import { copy } from 'fs-extra'
import { load as loadJson, update as updateJson } from 'json-update'
import mkdirp from 'mkdirp-promise'
import exists from 'path-exists'
import Listr from 'listr'
import path from 'path'
import uniq from 'uniq'
import url from 'url'
import { info, step } from '../util/cli'
import { locatePackageJson, recursiveFileList } from '../util/fs'

export default initCommand
export { initInDirectory }

const templateDependencies = [
  'dotenv@^2.0.0',
  'flux-capacitor@^0.3.0',
  'flux-capacitor-boot@^0.2.1',
  'flux-capacitor-sequelize@^0.2.3'
]

async function initCommand (options, args) {
  const destPath = args.length > 0 ? args[0] : process.cwd()

  const defaultDatabase = 'sqlite://db.sqlite'
  const { database = defaultDatabase } = options

  if (args.length > 1) {
    throw new Error(`Unexpected multiple arguments.`)
  }
  if (!('database' in options)) {
    info(`No --database passed. Using default: ${defaultDatabase}`)
  }
  if (Array.isArray(database)) {
    throw new Error(`Only one database connection URL allowed.`)
  }

  await initInDirectory(destPath, database)
}

async function initInDirectory (destPath, database) {
  const templatePath = path.resolve(__dirname, '..', '..', 'template')
  const dbDriverPackage = url.parse(database).protocol.replace(/:$/, '')

  const generatedFiles = [ '.gitignore', '.env' ]
  const templateFiles = await recursiveFileList(templatePath)
  const packageJsonPath = await locateOrCreatePackageJson(destPath)

  console.log('')   // just for the newline

  await new Listr([
    step('Copy boilerplate files', async () => {
      await assertFilesCanBeCopied(destPath, templateFiles.concat(generatedFiles))
      await copyTemplate(templatePath, templateFiles, destPath)
    }),
    step('Create .gitignore & .env file', async () => {
      await createDotFiles(destPath, { database })
    }),
    step('Update package.json', async () => {
      await patchPackageJson(packageJsonPath, path.join(destPath, 'store.js'), path.join(destPath, 'server.js'))
    }),
    step('Install dependencies', async () => {
      const packages = templateDependencies.concat([ dbDriverPackage ])
      await installPackages(packages, destPath)
    })
  ]).run()
}

async function assertFilesCanBeCopied (destPath, filePaths) {
  const topLevelFileDirNames = uniq(filePaths
    .map((filePath) => filePath.split(path.sep).shift())
  )

  await Promise.all(
    topLevelFileDirNames
      .map((fileName) => path.join(destPath, fileName))
      .map((filePath) => assertExistsNot(filePath))
  )
}

async function assertExistsNot (filePath) {
  if (await exists(filePath)) {
    throw new Error(`File/directory already exists: ${filePath}`)
  }
}

async function locateOrCreatePackageJson (searchStartDirPath) {
  try {
    const filePath = await locatePackageJson(searchStartDirPath)
    info(`Found package.json: ${filePath}`)
    return filePath
  } catch (error) {
    const filePath = path.join(searchStartDirPath, 'package.json')
    info(`Creating empty ${filePath}...`)
    await fs.writeFile(filePath, '{}\n')
    return filePath
  }
}

async function patchPackageJson (filePath, storeJsPath, serverJsPath) {
  const previousContent = await loadJson(filePath)
  const diff = {
    flux: {
      store: path.relative(path.dirname(filePath), storeJsPath)
    },
    scripts: Object.assign({
      start: `node ${path.relative(path.dirname(filePath), serverJsPath)}`
    }, previousContent.scripts)
  }

  return await updateJson(filePath, diff)
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

async function createDotFiles (destPath, { database }) {
  const envFilePath = path.join(destPath, '.env')
  const gitIgnoreFilePath = path.join(destPath, '.gitignore')

  await fs.writeFile(envFilePath, deindent`
    PORT=3000
    DB_CONNECTION=${database}
  `.trimLeft())

  await fs.writeFile(gitIgnoreFilePath, deindent`
    node_modules/
    npm-debug.log
  `.trimLeft())
}

async function installPackages (packageNames, cwd = process.cwd()) {
  const npmInstallCommand = `npm install --save ${packageNames.join(' ')}`
  return await execa.shell(npmInstallCommand, { cwd })
}
