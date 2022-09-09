/**
 * @file Plugins - tsconfig-paths
 * @module mkbuild/plugins/tsconfig-paths/plugin
 * @see https://github.com/dividab/tsconfig-paths
 */

import { MODULE_EXTENSIONS } from '#src/config/constants'
import resolveAliases from '#src/utils/resolve-aliases'
import type {
  BuildOptions,
  BuildResult,
  OutputFile,
  Plugin,
  PluginBuild
} from 'esbuild'
import * as pathe from 'pathe'
import { createMatchPath, type MatchPath } from 'tsconfig-paths'
import {
  tsConfigLoader,
  type TsConfigLoaderResult
} from 'tsconfig-paths/lib/tsconfig-loader'

import type Options from './options'

/**
 * Plugin name.
 *
 * @const {string} PLUGIN_NAME
 */
const PLUGIN_NAME: string = 'tsconfig-paths'

/**
 * Returns a [`tsconfig-paths`][1] plugin.
 *
 * [1]: https://github.com/dividab/tsconfig-paths
 *
 * @param {Options} [options={}] - Plugin options
 * @return {Plugin} `tsconfig-paths` plugin
 */
const plugin = ({
  extensions = MODULE_EXTENSIONS,
  fileExists,
  mainFields = ['main', 'module'],
  readJson
}: Options = {}): Plugin => {
  /**
   * Resolves path aliases in output file content.
   *
   * [1]: https://github.com/dividab/tsconfig-paths
   * [2]: https://esbuild.github.io/plugins
   * [3]: https://esbuild.github.io/api/#build-api
   *
   * @param {PluginBuild} build - [esbuild plugin api][2]
   * @param {BuildOptions} build.initialOptions - [esbuild build api][3] options
   * @param {PluginBuild['onEnd']} build.onEnd - Build end callback
   * @param {PluginBuild['onStart']} build.onStart - Build start callback
   * @return {void} Nothing when complete
   */
  const setup = ({ initialOptions, onEnd, onStart }: PluginBuild): void => {
    const {
      absWorkingDir = process.cwd(),
      bundle,
      format = 'esm',
      tsconfig
    } = initialOptions

    // esbuild handles path aliases when bundling
    if (bundle) return

    /**
     * Tsconfig loader result.
     *
     * @const {TsConfigLoaderResult} result
     */
    const result: TsConfigLoaderResult = tsConfigLoader({
      cwd: absWorkingDir,
      /**
       * Returns the value of `key`.
       *
       * @param {string} key - Environment variable key
       * @return {string | undefined} Value of `key`
       */
      getEnv(key: string): string | undefined {
        return key === 'TS_NODE_PROJECT'
          ? tsconfig ?? process.env[key]
          : process.env[key]
      }
    })

    // tsconfig couldn't be found
    if (!result.tsConfigPath) {
      return void onStart(() => ({
        /* c8 ignore next 2 */
        errors: [{ pluginName: PLUGIN_NAME, text: 'tsconfig not found' }]
      }))
    }

    /**
     * Path matching function.
     *
     * @const {MatchPath} matcher
     */
    const matcher: MatchPath = createMatchPath(
      pathe.resolve(pathe.dirname(result.tsConfigPath), result.baseUrl ?? ''),
      result.paths ?? {},
      mainFields,
      result.baseUrl !== undefined
    )

    return void onEnd((result: BuildResult): void => {
      /* c8 ignore next 13 */
      result.outputFiles = result.outputFiles!.map((output: OutputFile) => {
        return resolveAliases(
          output,
          result.metafile!,
          format,
          matcher,
          absWorkingDir,
          extensions,
          fileExists,
          readJson
        )
      })
    })
  }

  return { name: PLUGIN_NAME, setup }
}

export { plugin as default, type Options }
