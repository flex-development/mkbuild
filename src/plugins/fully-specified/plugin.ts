/**
 * @file Plugins - fully-specified
 * @module mkbuild/plugins/fully-specified
 */

import { MODULE_EXTENSIONS } from '#src/config/constants'
import type { Entry } from '#src/interfaces'
import extractStatements from '#src/utils/extract-statements'
import resolveSpecifier from '#src/utils/resolve-specifier'
import type {
  BuildOptions,
  BuildResult,
  OutputFile,
  Plugin,
  PluginBuild
} from 'esbuild'
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
   * @see {@link resolveSpecifier}
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
         * Relative path to source file.
         *
         * **Note**: Relative to {@link absWorkingDir}.
         *
         * @const {string} source
         */
        const source: string = result.metafile!.outputs[outfile]!.entryPoint!

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
           * {@link statement.code} before specifier resolution.
           *
           * @const {string} code
           */
          const code: string = statement.code

          // add extension to module specifier
          await resolveSpecifier(
            statement,
            pathe.resolve(absWorkingDir, source),
            format,
            ext as Entry['ext'],
            extensions
          )

          // replace code in text
          text = text.replace(code, statement.code)
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
