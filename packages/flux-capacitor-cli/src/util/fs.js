import fs from 'mz/fs'
import exists from 'path-exists'
import path from 'path'

export {
  locatePackageJson,
  recursiveFileList
}

/**
 * @param {string} dirPath        Directory to search recursively.
 * @return {Promise<string[]>}    Array of paths to all files (no directories) in `dirPath` and its sub-directories.
 */
async function recursiveFileList (dirPath) {
  const basenames = await fs.readdir(dirPath)
  const stats = await Promise.all(
    basenames.map((basename) => fs.stat(path.join(dirPath, basename)))
  )

  const fileNames = basenames.filter((_, index) => !stats[ index ].isDirectory())
  const dirNames = basenames.filter((_, index) => stats[ index ].isDirectory())

  const subDirFileArrays = await Promise.all(
    dirNames.map((dirName) => recursiveFileList(path.join(dirPath, dirName)))
  )
  const subDirFiles = subDirFileArrays.reduce(
    (allSubDirFilePaths, subDirFileNames, index) => allSubDirFilePaths.concat(
      subDirFileNames.map((subDirFileName) => path.join(dirNames[ index ], subDirFileName))
    ),
    []
  )

  return fileNames.concat(subDirFiles)
}

/**
 * Searches the given directory and all its parent directories for a `package.json`.
 *
 * @param {string} dirPath
 * @return {Promise<string>} Resoles to the path to the `package.json` or rejects.
 */
async function locatePackageJson (dirPath = process.cwd()) {
  const realPath = path.isAbsolute(dirPath) ? dirPath : await fs.realpath(dirPath)
  const parentPath = path.dirname(realPath)
  const filePath = path.join(realPath, 'package.json')

  if (await exists(filePath)) {
    return filePath
  } else if (parentPath !== realPath) {
    return await locatePackageJson(parentPath)
  } else {
    throw new Error(`package.json file not found.`)
  }
}
