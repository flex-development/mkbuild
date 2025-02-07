/**
 * @file Internal - readPackageJson
 * @module mkbuild/internal/readPackageJson
 */

import dfs from '#internal/fs'
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
 * @return {PackageJson | null}
 *  Package manifest object
 */
function readPackageJson(
  root: mlly.ModuleId,
  fs?: mlly.FileSystem | null | undefined
): PackageJson | null {
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

  return pkg && cache.set(root, pkg), pkg
}
