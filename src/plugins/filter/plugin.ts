/**
 * @file Plugins - filter
 * @module mkbuild/plugins/filter/plugin
 */

import type { OutputMetadata } from '#src/types'
import type {
  BuildOptions,
  BuildResult,
  OutputFile,
  Plugin,
  PluginBuild
} from 'esbuild'

/**
 * Returns an {@linkcode OutputFile.path} filter plugin.
 *
 * @param {RegExp} [filter=/.+/] - {@linkcode OutputFile.path} filter
 * @return {Plugin} Output file path filter plugin
 */
const plugin = (filter: RegExp = /.+/): Plugin => {
  /**
   * Filters output files.
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
    // metafile required to filter output metadata from result.metafile
    if (!initialOptions.metafile) throw new Error('metafile required')

    // esbuild write must be disabled to filter result.outputFiles
    if (initialOptions.write) throw new Error('write must be disabled')

    // filter output files
    return void onEnd(
      (result: BuildResult<{ metafile: true; write: false }>): void => {
        /**
         * Output file metadata.
         *
         * @const {Record<string, OutputMetadata>} outputs
         */
        const outputs: Record<string, OutputMetadata> = {}

        // filter output files
        result.outputFiles = result.outputFiles.filter((output: OutputFile) => {
          return filter.test(output.path)
        })

        // filter output file metadata
        for (const output of Object.entries(result.metafile.outputs)) {
          const [outfile, metadata] = output
          if (result.outputFiles.some(o => o.path.endsWith(outfile))) {
            outputs[outfile] = metadata
          }
        }

        // reset metafile
        result.metafile = {
          inputs: result.metafile.inputs,
          outputs
        }

        return void result
      }
    )
  }

  return { name: 'filter', setup }
}

export default plugin
