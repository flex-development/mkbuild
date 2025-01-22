/**
 * @file Utilities - loadBuildConfig
 * @module mkbuild/utils/loadBuildConfig
 */

import dfs from '#internal/fs'
import defineBuildConfig from '#utils/define-build-config'
import type { Config, ResolvedConfig } from '@flex-development/mkbuild'
import * as mlly from '@flex-development/mlly'
import pathe, { type Ext } from '@flex-development/pathe'
import json5 from 'json5'

/**
 * Load a build configuration.
 *
 * @see {@linkcode ResolvedConfig}
 * @see {@linkcode mlly.FileSystem}
 * @see {@linkcode mlly.ModuleId}
 *
 * @category
 *  utils
 *
 * @async
 *
 * @this {void}
 *
 * @param {URL | string | null | undefined} [location]
 *  Module id of directory to search
 * @param {mlly.FileSystem | null | undefined} [fs]
 *  File system API
 * @return {Promise<ResolvedConfig>}
 *  Resolved build configuration
 */
async function loadBuildConfig(
  this: void,
  location?: mlly.ModuleId | null | undefined,
  fs?: mlly.FileSystem | null | undefined
): Promise<ResolvedConfig> {
  if (!location) location = pathe.cwd()

  if (typeof location !== 'string') {
    location = String(location)
  } else if (!location.startsWith('file:')) {
    location = String(pathe.pathToFileURL(location))
  }

  location = new URL(location.replace(/\/$/, '') + pathe.sep)

  /**
   * Module extensions to probe for.
   *
   * @const {Ext[]} extensions
   */
  const extensions: Ext[] = [
    '.js',
    '.json',
    '.json5',
    '.jsonc',
    '.mjs',
    '.mts',
    '.ts'
  ]

  /**
   * List of possible config file URLs.
   *
   * @const {URL[]} tries
   */
  const tries: URL[] = [
    location,
    ...extensions.map(ext => new URL('build.config' + ext, location))
  ]

  /**
   * Build configuration.
   *
   * @var {Config | null | undefined} config
   */
  let config: Config | null | undefined

  /**
   * URL of configuration file.
   *
   * @var {URL | null} url
   */
  let url: URL | null = null

  // search for and load config
  for (const id of tries) {
    if (mlly.isFile(id, fs)) {
      url = id

      // load config
      config = pathe.matchesGlob(url.href, '*.json*', { basename: true })
        ? json5.parse(String((fs ?? dfs).readFileSync(url)))
        : (await import(url.href) as { default?: Config | null }).default

      break
    }
  }

  return { config: defineBuildConfig(config), url }
}

export default loadBuildConfig
