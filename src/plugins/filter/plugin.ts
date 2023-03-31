/**
 * @file Plugins - filter
 * @module mkbuild/plugins/filter/plugin
 */

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
    // esbuild write must be disabled to access result.outputFiles
    if (initialOptions.write) throw new Error('write must be disabled')

    // filter output files
    return void onEnd((result: BuildResult): void => {
      result.outputFiles = result.outputFiles!.filter((output: OutputFile) => {
        return filter.test(output.path)
      })

      return void result.outputFiles
    })
  }

  return { name: 'filter', setup }
}

export default plugin
