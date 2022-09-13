/**
 * @file Plugins - fully-specified
 * @module mkbuild/plugins/fully-specified
 */

import { MODULE_EXTENSIONS } from '#src/config/constants'
import extractStatements from '#src/utils/extract-statements'
import type {
  BuildOptions,
  BuildResult,
  OutputFile,
  Plugin,
  PluginBuild
} from 'esbuild'
import { resolvePath } from 'mlly'
import * as pathe from 'pathe'
import type Options from './options'

/**
 * Plugin name.
 *
 * @const {string} PLUGIN_NAME
 */
const PLUGIN_NAME: string = 'fully-specified'

/**
 * Returns a specifier resolver plugin.
 *
 * The resolver adds file extensions to relative specifiers in output content.
 *
 * A relative specifier, like `'./startup.js'` or `'../config.mjs'`, refers to
 * a path relative to the location of the importing file.
 *
 * Unless [`--experimental-specifier-resolution=node`][1] is used to customize
 * the ESM specifier resolution algorithm, file extensions are required.
 *
 * [1]: https://nodejs.org/docs/latest-v16.x/api/esm.html#customizing-esm-specifier-resolution-algorithm
 *
 * @param {Options} [options={}] - Plugin options
 * @return {Plugin} Specifier resolver plugin
 */
const plugin = ({ extensions = MODULE_EXTENSIONS }: Options = {}): Plugin => {
  /**
   * Adds file extensions to relative specifiers in output file content.
   *
   * [1]: https://esbuild.github.io/plugins
   * [2]: https://esbuild.github.io/api/#build-api
   *
   * @param {PluginBuild} build - [esbuild plugin api][1]
   * @param {BuildOptions} build.initialOptions - [esbuild build api][2] options
   * @param {PluginBuild['onEnd']} build.onEnd - Build end callback
   * @param {PluginBuild['onStart']} build.onStart - Build start callback
   * @return {void} Nothing when complete
   */
  const setup = ({ initialOptions, onEnd, onStart }: PluginBuild): void => {
    const {
      absWorkingDir = process.cwd(),
      format = 'esm',
      metafile,
      outExtension: { '.js': ext = '.js' } = {}
    } = initialOptions

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

    return void onEnd(async (result: BuildResult): Promise<void> => {
      /**
       * Output file objects.
       *
       * @const {OutputFile[]} outputFiles
       */
      const outputFiles: OutputFile[] = []

      for (const output of result.outputFiles!) {
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

        for (const statement of extractStatements(output.text)) {
          /**
           * {@link statement.specifier} before specifier resolution.
           *
           * @var {string | undefined} specifier
           */
          let specifier: string | undefined = statement.specifier

          // do nothing if missing module specifier
          if (!specifier) continue

          // do nothing if specifier is not relative
          if (!specifier.startsWith('.')) continue

          // do nothing if specifier already includes file extension
          if (pathe.extname(specifier)) continue

          /**
           * {@link specifier} resolved.
           *
           * @see https://github.com/unjs/mlly#resolvepath
           *
           * @const {string} resolved
           */
          const resolved: string = await resolvePath(specifier, {
            conditions: [format === 'esm' ? 'import' : 'require'],
            extensions,
            url: pathe.resolve(
              absWorkingDir,
              result.metafile!.outputs[outfile]!.entryPoint!
            )
          })

          const { name } = pathe.parse(specifier)
          const { name: resolved_name } = pathe.parse(resolved)

          // specifier resolved to a directory
          if (name !== resolved_name) specifier += '/' + resolved_name

          // add output file extension to specifier
          specifier += ext

          // replace specifier
          text = text.replace(
            statement.code,
            statement.code.replace(statement.specifier!, specifier)
          )
        }

        outputFiles.push({
          ...output,
          contents: new Uint8Array(Buffer.from(text)),
          text
        })
      }

      return void (result.outputFiles = outputFiles)
    })
  }

  return { name: PLUGIN_NAME, setup }
}

export default plugin
