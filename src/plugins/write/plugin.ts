/**
 * @file Plugins - write
 * @module mkbuild/plugins/write/plugin
 */

import fsa from '#src/utils/fs'
import pathe from '@flex-development/pathe'
import type { BuildOptions, BuildResult, Plugin, PluginBuild } from 'esbuild'
import type Options from './options'

/**
 * Returns a output file writer plugin.
 *
 * @param {Options} [options] - Plugin options
 * @return {Plugin} Output file writer plugin
 */
const plugin = ({
  mkdir = fsa.mkdir,
  writeFile = fsa.writeFile
}: Options = {}): Plugin => {
  /**
   * Writes output files.
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

    // write output files
    return void onEnd(async (result: BuildResult): Promise<void> => {
      for (const output of result.outputFiles!) {
        await mkdir(pathe.dirname(output.path), { recursive: true })
        await writeFile(output.path, output.text, 'utf8')
      }
    })
  }

  return { name: 'write', setup }
}

export { plugin as default, type Options }
