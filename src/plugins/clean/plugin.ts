/**
 * @file Plugins - clean
 * @module mkbuild/plugins/clean/plugin
 */

import fsa from '#src/utils/fs'
import pathe from '@flex-development/pathe'
import type { BuildOptions, Plugin, PluginBuild } from 'esbuild'
import type Options from './options'

/**
 * Returns an output directory cleaner plugin.
 *
 * @param {Options} [options] - Plugin options
 * @return {Plugin} Output directory cleaner plugin
 */
const plugin = ({
  mkdir = fsa.mkdir,
  rm = fsa.rm,
  unlink = fsa.unlink
}: Options = {}): Plugin => {
  /**
   * Cleans an output directory.
   *
   * Does **not** clean an output directory if `initialOptions.outdir` resolves
   * to `initialOptions.absWorkingDir`. This prevents the current working
   * directory from being accidentally removed.
   *
   * [1]: https://esbuild.github.io/plugins
   * [2]: https://esbuild.github.io/api/#build-api
   *
   * @async
   *
   * @param {PluginBuild} build - [esbuild plugin api][1]
   * @param {BuildOptions} build.initialOptions - [esbuild build api][2] options
   * @return {Promise<void>} Nothing when complete
   */
  const setup = async ({ initialOptions }: PluginBuild): Promise<void> => {
    const { absWorkingDir = process.cwd(), outdir = 'dist' } = initialOptions

    /**
     * Absolute path to output directory.
     *
     * @const {string} path
     */
    const path: string = pathe.resolve(absWorkingDir, outdir).replace(/\/$/, '')

    // only clean output directory if outdir does not resolve to absWorkingDir
    if (absWorkingDir.replace(/\/$/, '') !== path) {
      // unlink output directory
      await unlink(path).catch(() => ({}))

      // try removing output directory
      await rm(path, { recursive: true }).catch(() => ({}))

      // recreate output directory
      await mkdir(path, { recursive: true })
    }

    return void path
  }

  return { name: 'clean', setup }
}

export { plugin as default, type Options }
