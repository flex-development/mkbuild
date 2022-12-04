/**
 * @file Plugins - fully-specified
 * @module mkbuild/plugins/fully-specified
 */

import { EXT_JS_REGEX, EXT_TS_REGEX } from '#src/config/constants'
import type { OutputMetadata } from '#src/types'
import {
  resolveModules,
  RESOLVE_EXTENSIONS,
  type Ext
} from '@flex-development/mlly'
import type {
  BuildOptions,
  BuildResult,
  OutputFile,
  Plugin,
  PluginBuild
} from 'esbuild'
import * as pathe from 'pathe'

/**
 * Returns a specifier resolver plugin. There are three types of specifiers:
 *
 * > - *Relative specifiers* like `'./startup.js'` or `'../config.mjs'`. They
 * >   refer to a path relative to the location of the importing file. The file
 * >   extension is always necessary for these.
 * > - *Bare specifiers* like `'some-package'` or `'some-package/shuffle'`. They
 * >   can refer to the main entry point of a package by the package name, or a
 * >   specific feature module within a package prefixed by the package name as
 * >   per the examples respectively. Including the file extension is only
 * >   necessary for packages without an ["exports"][1] field.
 * > - *Absolute specifiers* like `'file:///opt/nodejs/config.js'`. They refer
 * >   directly and explicitly to a full path.
 *
 * The resolver adds file extensions to **bare** and **relative** specifiers in
 * output content.
 *
 * **Note**: [`--experimental-specifier-resolution=node`][2] can be used to
 * customize the ESM specifier resolution algorithm so that file extensions are
 * not required.
 *
 * [1]: https://nodejs.org/docs/latest-v16.x/api/packages.html#exports
 * [2]: https://nodejs.org/docs/latest-v16.x/api/esm.html#customizing-esm-specifier-resolution-algorithm
 *
 * @see https://nodejs.org/docs/latest-v16.x/api/esm.html#terminology
 *
 * @return {Plugin} Specifier resolver plugin
 */
const plugin = (): Plugin => {
  /**
   * Adds file extensions to relative specifiers in output file content.
   *
   * [1]: https://esbuild.github.io/plugins
   * [2]: https://esbuild.github.io/api/#build-api
   *
   * @param {PluginBuild} build - [esbuild plugin api][1]
   * @param {BuildOptions} build.initialOptions - [esbuild build api][2] options
   * @param {PluginBuild['onEnd']} build.onEnd - Build end callback
   * @return {void} Nothing when complete
   * @throws {Error}
   */
  const setup = ({ initialOptions, onEnd }: PluginBuild): void => {
    const {
      absWorkingDir = process.cwd(),
      bundle,
      format = 'esm',
      metafile,
      outExtension: { '.js': ext = '.js' } = {},
      resolveExtensions: extensions = RESOLVE_EXTENSIONS
    } = initialOptions

    // bundle output shouldn't contain relative specifiers
    if (bundle) return void bundle

    // metafile required to get output metadata
    if (!metafile) throw new Error('metafile required')

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
         * Absolute path to source file.
         *
         * @const {string} parent
         */
        const parent: string = pathe.resolve(absWorkingDir, metadata.entryPoint)

        /**
         * {@link output.text} with fully specified modules.
         *
         * @const {string} text
         */
        const text: string = await resolveModules(output.text, {
          conditions: [format === 'esm' ? 'import' : 'require'],
          /**
           * Replaces the file extension of `specifier` if specifier does not
           * already include an extension.
           *
           * @param {string} specifier - Module specifier in {@link output.text}
           * @param {string} resolved - `specifier` as absolute specifier
           * @return {Ext} New extension for `specifier` or original extension
           */
          ext(specifier: string, resolved: string): Ext {
            const { ext: s_ext } = pathe.parse(specifier)

            // do nothing if specifier already includes file extension
            // replace file extension otherwise
            return (s_ext === pathe.extname(resolved) ? s_ext : ext) as Ext
          },
          extensions,
          parent
        })

        outputFiles.push({
          ...output,
          contents: new Uint8Array(Buffer.from(text)),
          text
        })
      }

      return void (result.outputFiles = outputFiles)
    })
  }

  return { name: 'fully-specified', setup }
}

export default plugin
