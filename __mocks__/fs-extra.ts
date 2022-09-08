/**
 * @file Mocks - fs-extra
 * @module mocks/fs-extra
 * @see https://github.com/jprichardson/node-fs-extra
 * @see https://nodejs.org/docs/latest-v16.x/api/fs.html
 */

import volume from '#fixtures/volume'
import type { PathLike } from 'fs-extra'
import type { IWriteFileOptions, TData, TFileId, TMode } from 'memfs/lib/volume'

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

export default { mkdirp, writeFile }
