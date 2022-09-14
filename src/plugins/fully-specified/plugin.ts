/**
 * @file Plugins - fully-specified
 * @module mkbuild/plugins/fully-specified
 */

import {
  EXT_JS_REGEX,
  EXT_TS_REGEX,
  RESOLVE_EXTENSIONS
} from '#src/config/constants'
import type { OutputMetadata } from '#src/types'
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
const plugin = ({ extensions = RESOLVE_EXTENSIONS }: Options = {}): Plugin => {
  /**
   * Adds file extensions to relative specifiers in output file content.
   *
   * @todo check specifiers in files interpreted with copy or file loader
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
      bundle,
      format = 'esm',
      metafile,
      outExtension: { '.js': ext = '.js' } = {}
    } = initialOptions

    // bundle output shouldn't contain relative specifiers
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

    return void onEnd(async (result: BuildResult): Promise<void> => {
      /**
       * Output file objects.
       *
       * @const {OutputFile[]} outputFiles
       */
      const outputFiles: OutputFile[] = []

      for (const output of result.outputFiles!) {
        /**
         * Output file extension.
         *
         * @const {string} output_ext
         */
        const output_ext: string = pathe.extname(output.path)

        // do nothing if output file isn't javascript or typescript
        if (!EXT_JS_REGEX.test(output_ext) && !EXT_TS_REGEX.test(output_ext)) {
          outputFiles.push(output)
          continue
        }

        /**
         * Relative path to output file.
         *
         * **Note**: Relative to {@link absWorkingDir}.
         *
         * @const {string} outfile
         */
        const outfile: string = output.path.replace(absWorkingDir + '/', '')

        /**
         * {@link output} metadata.
         *
         * @const {OutputMetadata} metadata
         */
        const metadata: OutputMetadata = result.metafile!.outputs[outfile]!

        // because this plugin doesn't handle bundles, the entry point can be
        // reset to the first (and only!) key in metadata.inputs
        if (!metadata.entryPoint) {
          metadata.entryPoint = Object.keys(metadata.inputs)[0]!
        }

        /**
         * {@link output.text} copy.
         *
         * @var {string} text
         */
        let text: string = output.text

        // replace specifiers
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
            url: pathe.resolve(absWorkingDir, metadata.entryPoint)
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
