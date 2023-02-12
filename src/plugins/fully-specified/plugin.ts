/**
 * @file Plugins - fully-specified
 * @module mkbuild/plugins/fully-specified
 */

import type { OutputMetadata } from '#src/types'
import type { NodeError } from '@flex-development/errnode'
import * as mlly from '@flex-development/mlly'
import * as pathe from '@flex-development/pathe'
import type {
  BuildOptions,
  BuildResult,
  OnEndResult,
  OutputFile,
  Plugin,
  PluginBuild
} from 'esbuild'
import util from 'node:util'

/**
 * Plugin name.
 *
 * @const {string} PLUGIN_NAME
 */
const PLUGIN_NAME: string = 'fully-specified'

/**
 * Returns a specifier resolver plugin. There are three types of specifiers:
 *
 * > - *Relative specifiers* like `'./startup.js'` or `'../config.mjs'`. They
 * >   refer to a path relative to the location of the importing file. *The file
 * >   extension is always necessary for these.*
 * > - *Bare specifiers* like `'some-package'` or `'some-package/shuffle'`. They
 * >   can refer to the main entry point of a package by the package name, or a
 * >   specific feature module within a package prefixed by the package name as
 * >   per the examples respectively. *Including the file extension is only
 * >   necessary for packages without an [`"exports"`][1] field.*
 * > - *Absolute specifiers* like `'file:///opt/nodejs/config.js'`. They refer
 * >   directly and explicitly to a full path.
 *
 * The resolver adds file extensions to **absolute** and **relative** specifiers
 * in output content.
 *
 * **Note**: [`--experimental-specifier-resolution=node`][2] can be used to
 * customize the ESM specifier resolution algorithm so that file extensions are
 * not required.
 *
 * [1]: https://nodejs.org/api/packages.html#exports
 * [2]: https://nodejs.org/api/esm.html#customizing-esm-specifier-resolution-algorithm
 *
 * @see https://nodejs.org/api/esm.html#terminology
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
      conditions,
      metafile,
      outExtension: { '.js': ext = '.js' } = {},
      resolveExtensions,
      preserveSymlinks,
      write
    } = initialOptions

    // bundle output shouldn't contain relative specifiers
    if (bundle) return void bundle

    // esbuild write must be disabled to access result.outputFiles
    if (write) throw new Error('write must be disabled')

    // metafile required to get output metadata
    if (!metafile) throw new Error('metafile required')

    return void onEnd(async (result: BuildResult): Promise<OnEndResult> => {
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
         * **Note**: Relative to {@linkcode absWorkingDir}.
         *
         * @const {string} outfile
         */
        const outfile: string = output.path
          .replace(absWorkingDir, '')
          .replace(/^\//, '')

        /**
         * {@linkcode output} metadata.
         *
         * @const {OutputMetadata} metadata
         */
        const metadata: OutputMetadata = result.metafile!.outputs[outfile]!

        // because this plugin doesn't handle bundles, the entry point can be
        // reset to the first (and only!) key in metadata.inputs
        if (!metadata.entryPoint) {
          const [entryPoint = ''] = Object.keys(metadata.inputs)
          metadata.entryPoint = entryPoint
        }

        // skip output files without entry points
        if (!metadata.entryPoint) {
          outputFiles.push(output)
          continue
        }

        try {
          /**
           * {@linkcode output.text} with fully specified modules.
           *
           * @const {string} text
           */
          const text: string = await mlly.fillModules(output.text, {
            conditions: new Set(conditions),
            ext,
            extensions: new Set(resolveExtensions),
            parent: mlly.toURL(pathe.join(absWorkingDir, metadata.entryPoint)),
            preserveSymlinks
          })

          // add output file with fully specified modules
          outputFiles.push({
            ...output,
            contents: new util.TextEncoder().encode(text),
            text
          })
        } catch (e: unknown) {
          const { code, message, stack = '' } = e as NodeError

          return {
            errors: [
              {
                id: code,
                location: null,
                notes: [{ location: null, text: stack }],
                pluginName: PLUGIN_NAME,
                text: message
              }
            ]
          }
        }
      }

      // reset output files
      result.outputFiles = outputFiles

      return {}
    })
  }

  return { name: PLUGIN_NAME, setup }
}

export default plugin
