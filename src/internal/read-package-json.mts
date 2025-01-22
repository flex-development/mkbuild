/**
 * @file Internal - readPackageJson
 * @module mkbuild/internal/readPackageJson
 */

import dfs from '#internal/fs'
import {
  ERR_MODULE_NOT_FOUND,
  type ErrModuleNotFound
} from '@flex-development/errnode'
import * as mlly from '@flex-development/mlly'
import pathe from '@flex-development/pathe'
import type { PackageJson } from '@flex-development/pkg-types'
import { ok } from 'devlop'

/**
 * Package manifest cache.
 *
 * @internal
 *
 * @const {Map<string, PackageJson>} cache
 */
const cache: Map<string, PackageJson> = new Map<string, PackageJson>()

export default readPackageJson
readPackageJson.cache = cache

/**
 * Load a `package.json` file.
 *
 * @see {@linkcode ErrModuleNotFound}
 * @see {@linkcode PackageJson}
 * @see {@linkcode mlly.FileSystem}
 * @see {@linkcode mlly.ModuleId}
 *
 * @internal
 *
 * @param {mlly.ModuleId} root
 *  Absolute module id of working directory
 * @param {mlly.FileSystem | null | undefined} [fs]
 *  File system API
 * @return {PackageJson}
 *  Package manifest object
 * @throws {ErrModuleNotFound}
 *  If `package.json` file is not found
 */
function readPackageJson(
  root: mlly.ModuleId,
  fs?: mlly.FileSystem | null | undefined
): PackageJson {
  ok(String(root).endsWith('/'), 'expected trailing slash ("/") end')

  root = pathe.toPath(root)
  if (cache.has(root)) return cache.get(root)!

  /**
   * Package manifest.
   *
   * @const {PackageJson | null} pkg
   */
  const pkg: PackageJson | null = mlly.readPackageJson(
    pathe.pathToFileURL(root),
    null,
    null,
    fs ?? dfs
  )

  if (!pkg) {
    throw new ERR_MODULE_NOT_FOUND(
      pathe.join(root, 'package.json'),
      import.meta.url,
      new URL('package.json', pathe.pathToFileURL(root))
    )
  }

  return cache.set(root, pkg), pkg
}
