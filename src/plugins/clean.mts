/**
 * @file Plugins - clean
 * @module mkbuild/plugins/clean
 */

import pathe from '@flex-development/pathe'
import { ok } from 'devlop'
import type {
  NormalizedOutputOptions,
  Plugin,
  PluginContext
} from 'rollup'

/**
 * Plugin name.
 *
 * @internal
 *
 * @const {string} PLUGIN_NAME
 */
const PLUGIN_NAME: string = 'mkbuild:clean'

/**
 * Cleaned directory cache.
 *
 * @internal
 *
 * @const {Set<string>} directories
 */
const directories: Set<string> = new Set<string>()

plugin.PLUGIN_NAME = PLUGIN_NAME
plugin.directories = directories

export default plugin

/**
 * Create an output directory cleaner plugin.
 *
 * @internal
 *
 * @see {@linkcode Plugin}
 *
 * @this {void}
 *
 * @return {Plugin}
 *  Output directory cleaner plugin
 */
function plugin(this: void): Plugin {
  return {
    name: PLUGIN_NAME,
    renderStart: { handler: renderStart, order: 'pre', sequential: true }
  }

  /**
   * Remove and recreate an output directory.
   *
   * @see https://rollupjs.org/plugin-development/#renderstart
   *
   * @async
   *
   * @this {PluginContext}
   *
   * @param {NormalizedOutputOptions} output
   *  Normalized output options
   * @return {Promise<undefined>}
   */
  async function renderStart(
    this: PluginContext,
    output: NormalizedOutputOptions
  ): Promise<undefined> {
    ok(typeof output.clean === 'boolean', 'expected `output.clean`')
    ok(typeof output.fs === 'object', 'expected `output.fs`')
    ok(typeof output.root === 'string', 'expected `output.root`')
    ok(typeof output.write === 'boolean', 'expected `output.write`')

    if (
      output.clean &&
      output.root &&
      output.write &&
      typeof output.dir === 'string'
    ) {
      directories.add(output.root)

      /**
       * Absolute path to output directory.
       *
       * @const {string} path
       */
      const path: string = pathe.join(output.root, output.dir)

      if (!directories.has(path)) {
        await output.fs.rm(path, { force: true, recursive: true })
        await output.fs.mkdir(path, { recursive: true })
      }

      directories.add(path)
    }

    return void this
  }
}
