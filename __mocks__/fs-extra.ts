/**
 * @file Mocks - fs-extra
 * @module mocks/fs-extra
 * @see https://github.com/jprichardson/node-fs-extra
 * @see https://nodejs.org/docs/latest-v16.x/api/fs.html
 */

import volume from '#fixtures/volume'
import type { PathLike } from 'fs-extra'
import type { Dirent } from 'memfs/lib/Dirent'
import type { TDataOut } from 'memfs/lib/encoding'
import type { Stats, TStatNumber } from 'memfs/lib/Stats'
import type {
  IReaddirOptions,
  IReadFileOptions,
  IStatOptions,
  IWriteFileOptions,
  TCallback,
  TData,
  TFileId,
  TMode
} from 'memfs/lib/volume'

/**
 * Ensures that a directory is empty.
 *
 * Deletes directory contents if the directory is not empty. If the directory
 * does not exist, it will be created. The directory itself is **not** deleted.
 *
 * @async
 *
 * @param {PathLike} dir - Directory to clear
 * @return {Promise<void>} Nothing when complete
 */
export const emptyDir = vi.fn(async (dir: PathLike): Promise<void> => {
  return new Promise(resolve => {
    try {
      return void resolve(void volume.readdirSync(dir))
    } catch {
      return void resolve(void volume.mkdirpSync(dir))
    }
  })
})

/**
 * Returns {@link Stats} for `path`.
 *
 * @see https://nodejs.org/docs/latest-v16.x/api/fs.html#fspromisesstatpath-options
 *
 * @param {PathLike} path - Path to retrieve stats for
 * @param {TCallback<Stats<TStatNumber>>} callback - Callback function
 * @return {void} Nothing when complete
 */
export const lstat = vi.fn(volume.lstat.bind(volume))

/**
 * Returns {@link Stats} for the symbolic link referred to by `path`.
 *
 * @see https://nodejs.org/docs/latest-v16.x/api/fs.html#fslstatsyncpath-options
 *
 * @param {PathLike} path - Path to retrieve stats for
 * @param {IStatOptions} [options] - Stat options
 * @return {Stats<number>} `Stats` for `path`
 */
export const lstatSync = vi.fn(volume.lstatSync.bind(volume))

/**
 * Ensures that `dir` exists.
 *
 * If the directory structure does not exist, it will be created.
 *
 * @async
 *
 * @param {PathLike} dir - Directory to ensure
 * @param {TMode} [mode] - Directory mode
 * @return {Promise<void>} Nothing when complete
 */
export const mkdirp = vi.fn(
  async (dir: PathLike, mode?: TMode): Promise<void> => {
    return new Promise(resolve => {
      return void resolve(void volume.mkdirpSync(dir, mode))
    })
  }
)

/**
 * Synchronously reads the entire contents of a file.
 *
 * @see https://nodejs.org/docs/latest-v16.x/api/fs.html#fsreadfilesyncpath-options
 *
 * @param {TFileId} path - Filename or handle
 * @param {IWriteFileOptions | string} [options] - Read file options
 * @return {TDataOut} File content
 */
export const readFileSync = vi.fn(volume.readFileSync.bind(volume))

/**
 * Reads a `JSON` file and parses it into an object.
 *
 * @async
 *
 * @param {string} file - Path to `JSON` file
 * @param {IReadFileOptions | string} [options] - Read file options
 * @return {Promise<Record<string, any>>} JSON object
 */
export const readJson = vi.fn(
  async (
    path: TFileId,
    options?: IReadFileOptions | string
  ): Promise<Record<string, any>> => {
    return new Promise(resolve => {
      /**
       * File content at {@link path}.
       *
       * @var {Buffer | string} content
       */
      let content: Buffer | string = volume.readFileSync(path, options)

      // convert content to a string
      if (content instanceof Buffer) content = content.toString()

      return void resolve(JSON.parse(content) as Record<string, any>)
    })
  }
)

/**
 * Reads the contents of a directory.
 *
 * @see https://nodejs.org/docs/latest-v16.x/api/fs.html#fspromisesreaddirpath-options
 *
 * @param {PathLike} path - Directory path
 * @param {TCallback<Dirent[] | TDataOut[]>} callback - Callback function
 * @return {void} Nothing when complete
 */
export const readdir = vi.fn(volume.readdir.bind(volume))

/**
 * Reads the contents of the directory at `path`.
 *
 * @see https://nodejs.org/docs/latest-v16.x/api/fs.html#fsreaddirsyncpath-options
 *
 * @param {PathLike} path - Directory path
 * @param {IReaddirOptions | string} [options] - Directory read options
 * @return {Dirent[] | TDataOut[]} Directory content
 */
export const readdirSync = vi.fn(volume.readdirSync.bind(volume))

/**
 * Returns {@link Stats} for the symbolic link referred to by `path`.
 *
 * @see https://nodejs.org/docs/latest-v16.x/api/fs.html#fslstatpath-options-callback
 *
 * @param {PathLike} path - Path to retrieve stats for
 * @param {TCallback<Stats<TStatNumber>>} callback - Callback function
 * @return {void} Nothing when complete
 */
export const stat = vi.fn(volume.stat.bind(volume))

/**
 * Returns {@link Stats} for `path`.
 *
 * @see https://nodejs.org/docs/latest-v16.x/api/fs.html#fsfstatsyncfd-options
 *
 * @param {PathLike} path - Path to retrieve stats for
 * @param {IStatOptions} [options] - Stat options
 * @return {Stats<number>} `Stats` for `path`
 */
export const statSync = vi.fn(volume.statSync.bind(volume))

/**
 * Deletes the file at `path` if `path` does not refer to symbolic link.
 *
 * If `path` refers to a symbolic link, the link will be removed without
 * affecting the file or directory to which that link refers.
 *
 * @see https://nodejs.org/docs/latest-v16.x/api/fs.html#fspromisesunlinkpath
 * @see https://man7.org/linux/man-pages/man2/unlink.2.html
 *
 * @async
 *
 * @param {PathLike} path - Path to unlink
 * @return {Promise<void>} Nothing when complete
 */
export const unlink = vi.fn(async (path: PathLike): Promise<void> => {
  return new Promise(resolve => void resolve(void volume.unlinkSync(path)))
})

/**
 * Asynchronously writes data to `file`, replacing `file` if it already exists.
 *
 * @see https://nodejs.org/docs/latest-v16.x/api/fs.html#fspromiseswritefilefile-data-options
 *
 * @async
 *
 * @param {TFileId} file - Filename or handle
 * @param {TData} data - File content
 * @param {IWriteFileOptions} [options] - Write file options
 * @return {Promise<void>} Nothing when complete
 */
export const writeFile = vi.fn(
  async (
    path: TFileId,
    data: TData,
    options?: IWriteFileOptions
  ): Promise<void> => {
    return new Promise(resolve => {
      return void resolve(void volume.writeFileSync(path, data, options))
    })
  }
)

export default {
  emptyDir,
  lstat,
  lstatSync,
  mkdirp,
  readFileSync,
  readJson,
  readdir,
  readdirSync,
  stat,
  statSync,
  unlink,
  writeFile
}
