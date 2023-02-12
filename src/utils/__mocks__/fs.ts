/**
 * @file Mock Utilities - fs
 * @module mkbuild/utils/mocks/fs
 */

import volume from '#fixtures/volume'
import type {
  IMkdirOptions,
  IRmOptions,
  IWriteFileOptions
} from 'memfs/lib/volume'
import fsc, {
  type MakeDirectoryOptions,
  type Mode,
  type PathLike,
  type RmOptions,
  type WriteFileOptions
} from 'node:fs'
import fsp from 'node:fs/promises'

/**
 * Creates a directory.
 *
 * @see https://nodejs.org/api/fs.html#fspromisesmkdirpath-options
 *
 * @async
 *
 * @param {PathLike} directory - Directory to create
 * @param {MakeDirectoryOptions | Mode} [options] - Directory creation options
 * @return {Promise<string | undefined>} First directory path created if
 * `options.recursive` is `true` or `undefined` if `false`
 */
const mkdir = vi.fn(
  async (
    directory: PathLike,
    options: MakeDirectoryOptions | Mode
  ): Promise<string | undefined> => {
    return volume.mkdirSync(directory, options as IMkdirOptions)
  }
)

/**
 * Removes the file or directory at the given module `id`.
 *
 * @see https://nodejs.org/api/fs.html#fspromisesrmpath-options
 *
 * @async
 *
 * @param {PathLike} id - Module id to evaluate
 * @param {RmOptions} [options] - Removal options
 * @return {Promise<void>} Nothing when complete
 */
const rm = vi.fn(async (id: PathLike, options?: RmOptions): Promise<void> => {
  return void volume.rmSync(id, options as IRmOptions)
})

/**
 * Writes the given `data` to `file`, replacing `file` if it already exists.
 *
 * @see https://nodejs.org/api/fs.html#fspromiseswritefilefile-data-options
 *
 * @async
 *
 * @param {PathLike} file - Filename or handle
 * @param {Uint8Array | string} data - File content
 * @param {WriteFileOptions} [options] - Write file options
 * @return {Promise<void>} Nothing when complete
 */
const writeFile = vi.fn(
  async (
    file: PathLike,
    data: Uint8Array | string,
    options?: WriteFileOptions
  ): Promise<void> => {
    return void volume.writeFileSync(file, data, options as IWriteFileOptions)
  }
)

export default {
  lstat: vi.fn(fsc.lstat.bind(fsc)),
  mkdir,
  readdir: vi.fn(fsp.readdir.bind(fsp)),
  readdirSync: vi.fn(fsc.readdirSync.bind(fsc)),
  rm,
  stat: vi.fn(fsc.stat.bind(fsc)),
  unlink: vi.fn(fsp.unlink.bind(fsp)),
  writeFile
}
