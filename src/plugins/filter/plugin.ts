/**
 * @file Plugins - filter
 * @module mkbuild/plugins/filter/plugin
 */

import type { OutputMetadata } from '#src/types'
import { entries, select } from '@flex-development/tutils'
import type { BuildOptions, BuildResult, Plugin, PluginBuild } from 'esbuild'

/**
 * Plugin-specific build options.
 *
 * @internal
 */
type SpecificOptions = { metafile: true; write: false }

/**
 * Returns an output file filter plugin.
 *
 * @param {RegExp} [filter=/.+/] - Output file path filter
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

    // filter output files and metadata
    return void onEnd((result: BuildResult<SpecificOptions>): void => {
      /**
       * Output file metadata.
       *
       * @const {Record<string, OutputMetadata>} outputs
       */
      const outputs: Record<string, OutputMetadata> = {}

      // filter output files
      result.outputFiles = select(result.outputFiles, o => filter.test(o.path))

      // filter output file metadata
      for (const [outfile, metadata] of entries(result.metafile.outputs)) {
        if (result.outputFiles.some(o => o.path.endsWith(outfile))) {
          outputs[outfile] = metadata
        }
      }

      // reset metafile
      result.metafile.outputs = outputs

      return void result
    })
  }

  return { name: 'filter', setup }
}

export default plugin
