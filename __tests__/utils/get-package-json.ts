/**
 * @file Test Utilities - getPackageJson
 * @module tests/utils/getPackageJson
 */

import type mlly from '@flex-development/mlly'
import type pkg from '@flex-development/pkg-types'
import { cast } from '@flex-development/tutils'

/**
 * Retrieves a `package.json` object.
 *
 * @see {@linkcode mlly.ModuleId}
 * @see {@linkcode pkg.PackageJson}
 *
 * @async
 *
 * @param {mlly.ModuleId} [id='package.json'] - Module id of `package.json` file
 * @return {Promise<pkg.PackageJson>} `package.json` object
 */
const getPackageJson = async (
  id: mlly.ModuleId = 'package.json'
): Promise<pkg.PackageJson> => {
  /**
   * [`node:fs`][1] module.
   *
   * [1]: https://nodejs.org/api/fs.html
   *
   * @const {typeof import('node:fs')} fs
   */
  const fs: typeof import('node:fs') = await vi.importActual('node:fs')

  return cast(JSON.parse(fs.readFileSync(id, 'utf8')))
}

export default getPackageJson
