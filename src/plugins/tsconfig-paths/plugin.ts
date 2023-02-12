/**
 * @file Plugins - tsconfig-paths
 * @module mkbuild/plugins/tsconfig-paths/plugin
 */

import type { OutputMetadata } from '#src/types'
import type { NodeError } from '@flex-development/errnode'
import pathe from '@flex-development/pathe'
import * as tscu from '@flex-development/tsconfig-utils'
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
const PLUGIN_NAME: string = 'tsconfig-paths'

/**
 * Returns a path alias resolution plugin.
 *
 * @see https://github.com/flex-development/tsconfig-utils#resolvepathscode-options
 *
 * @param {tscu.LoadTsconfigOptions} [options] - Plugin options
 * @return {Plugin} Path alias resolution plugin
 */
const plugin = ({ file, read }: tscu.LoadTsconfigOptions = {}): Plugin => {
  /**
   * Resolves path aliases in output file content.
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
      resolveExtensions,
      preserveSymlinks,
      tsconfig = 'tsconfig.json',
      write
    } = initialOptions

    // esbuild handles path aliases when bundling
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

      // resolve path aliases in output content
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
           * {@linkcode output.text} with path aliases replaced.
           *
           * @const {string} text
           */
          const text: string = await tscu.resolvePaths(output.text, {
            baseUrl: absWorkingDir,
            conditions: new Set(conditions),
            ext: '',
            extensions: new Set(resolveExtensions),
            file,
            parent: pathe.resolve(absWorkingDir, metadata.entryPoint),
            preserveSymlinks,
            read,
            tsconfig: pathe.resolve(absWorkingDir, tsconfig)
          })

          // add output file with path aliases replaced
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

export { plugin as default }
