/**
 * @file Plugins - tsconfig-paths
 * @module mkbuild/plugins/tsconfig-paths/plugin
 */

import { MODULE_EXTENSIONS } from '#src/config/constants'
import extractStatements from '#src/utils/extract-statements'
import resolveAlias from '#src/utils/resolve-alias'
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
      metafile,
      tsconfig
    } = initialOptions

    // esbuild handles path aliases when bundling
    if (bundle) return

    // metafile required to get output metadata
    if (!metafile) {
      return void onStart(() => ({
        errors: [
          {
            detail: 'https://esbuild.github.io/api/#metafile',
            pluginName: PLUGIN_NAME,
            text: 'metafile required'
          }
        ]
      }))
    }

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
        errors: [{ pluginName: PLUGIN_NAME, text: 'tsconfig not found' }]
      }))
    }

    /**
     * Path matching function.
     *
     * @const {MatchPath} matcher
     */
    const matcher: MatchPath = createMatchPath(
      /* c8 ignore next 2 */
      pathe.resolve(pathe.dirname(result.tsConfigPath), result.baseUrl ?? ''),
      result.paths ?? {},
      mainFields,
      result.baseUrl !== undefined
    )

    return void onEnd((result: BuildResult): void => {
      result.outputFiles = result.outputFiles!.map((output: OutputFile) => {
        /**
         * Relative path to output file.
         *
         * **Note**: Relative to {@link absWorkingDir}.
         *
         * @const {string} outfile
         */
        const outfile: string = output.path.replace(absWorkingDir + '/', '')

        /**
         * {@link output.text} copy.
         *
         * @var {string} text
         */
        let text: string = output.text

        for (const statement of extractStatements(output.text, format)) {
          // do nothing if missing module specifier
          if (!statement.specifier) continue

          /**
           * Possible path match for {@link statement.specifier}.
           *
           * @const {string | undefined} match
           */
          const match: string | undefined = matcher(
            statement.specifier,
            readJson,
            fileExists,
            extensions
          )

          // do nothing if path match was not found
          if (!match) continue

          /**
           * {@link statement.code} before path alias replacement.
           *
           * @const {string} code
           */
          const code: string = statement.code

          // resolve path alias in statement
          resolveAlias(
            statement,
            match,
            result.metafile!.outputs[outfile]!.entryPoint!
          )

          // replace code in text
          text = text.replace(code, statement.code)
        }

        return { ...output, contents: new Uint8Array(Buffer.from(text)), text }
      })
    })
  }

  return { name: PLUGIN_NAME, setup }
}

export { plugin as default, type Options }
