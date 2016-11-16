import fs from 'mz/fs'
import path from 'path'

export {
  recursiveFileList
}

/**
 * @param {string} dirPath        Directory to search recursively.
 * @return {Promise<string[]>}    Array of paths to all files (no directories) in `dirPath` and its sub-directories.
 */
async function recursiveFileList (dirPath) {
  const basenames = await fs.readdir(dirPath, 'UTF-8')
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
