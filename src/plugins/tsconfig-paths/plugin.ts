/**
 * @file Plugins - tsconfig-paths
 * @module mkbuild/plugins/tsconfig-paths/plugin
 */

import type { OutputMetadata } from '#src/types'
import type { NodeError } from '@flex-development/errnode'
import pathe from '@flex-development/pathe'
import * as tscu from '@flex-development/tsconfig-utils'
import { at, cast, constant, define, get, keys } from '@flex-development/tutils'
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
 * Plugin-specific build options.
 *
 * @internal
 */
type SpecificOptions = { metafile: true; write: false }

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

    return void onEnd(
      async (result: BuildResult<SpecificOptions>): Promise<OnEndResult> => {
        /**
         * Output file objects.
         *
         * @const {OutputFile[]} outputFiles
         */
        const outputFiles: OutputFile[] = []

        // resolve path aliases in output content
        for (const output of result.outputFiles) {
          /**
           * {@linkcode output} metadata.
           *
           * @const {OutputMetadata} metadata
           */
          const metadata: OutputMetadata = get(
            result.metafile.outputs,
            output.path.replace(absWorkingDir, '').replace(/^\//, '')
          )

          /**
           * Relative path to source file.
           *
           * @const {string} entryPoint
           */
          const entryPoint: string = get(
            metadata,
            'entryPoint',
            // because this plugin doesn't handle bundles, the entry point can
            // fallback to the first (and only!) key in metadata.inputs
            at(keys(metadata.inputs), 0, '')
          )

          // skip output files without entry points
          if (!entryPoint) {
            outputFiles.push(output)
            continue
          }

          // reset entry point
          metadata.entryPoint = entryPoint

          try {
            // replace path aliases
            define(output, 'text', {
              get: constant(
                await tscu.resolvePaths(output.text, {
                  baseUrl: absWorkingDir,
                  conditions: new Set(conditions),
                  ext: '',
                  extensions: new Set(resolveExtensions),
                  file,
                  parent: pathe.resolve(absWorkingDir, entryPoint),
                  preserveSymlinks,
                  read,
                  tsconfig: pathe.resolve(absWorkingDir, tsconfig)
                })
              )
            })

            // reset output contents
            output.contents = new util.TextEncoder().encode(output.text)

            // add output file with path aliases replaced
            outputFiles.push(output)
          } catch (e: unknown) {
            const { code, message, stack = '' } = cast<NodeError>(e)

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
      }
    )
  }

  return { name: PLUGIN_NAME, setup }
}

export { plugin as default }
