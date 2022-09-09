/**
 * @file Plugin Options - tsconfig-paths
 * @module mkbuild/plugins/tsconfig-paths/options
 */

import type { ReadJsonSync } from 'tsconfig-paths/lib/filesystem'

/**
 * [`tsconfig-paths`][1] plugin options.
 *
 * [1]: https://github.com/dividab/tsconfig-paths
 */
interface TsconfigPathsPluginOptions {
  /**
   * Module extensions to probe for.
   *
   * @default MODULE_EXTENSIONS
   */
  extensions?: string[]

  /**
   * Checks for the existence of a file at `path`.
   *
   * @param {string} path - Path to check
   * @return {boolean} `true` if file exists, `false` otherwise
   */
  fileExists?(path: string): boolean

  /**
   * `package.json` fields to check when resolving modules.
   *
   * A nested field can be selected by passing an array of field names.
   *
   * @default ['main', 'module']
   */
  mainFields?: (string[] | string)[]

  /**
   * Reads `JSON` data from a file.
   */
  readJson?: ReadJsonSync
}

export type { TsconfigPathsPluginOptions as default }
