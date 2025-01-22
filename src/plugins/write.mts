/**
 * @file Plugins - write
 * @module mkbuild/plugins/write
 */

import type { FileSystem } from '@flex-development/mkbuild'
import pathe from '@flex-development/pathe'
import { fallback } from '@flex-development/tutils'
import { ok } from 'devlop'
import type {
  NormalizedOutputOptions,
  OutputBundle,
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
const PLUGIN_NAME: string = 'mkbuild:write'

plugin.PLUGIN_NAME = PLUGIN_NAME
export default plugin

/**
 * Create an output file writer plugin.
 *
 * @internal
 *
 * @see {@linkcode FileSystem}
 * @see {@linkcode Plugin}
 *
 * @this {void}
 *
 * @return {Plugin}
 *  Output file writer plugin
 */
function plugin(this: void): Plugin {
  return {
    generateBundle: { handler: generateBundle, order: 'post' },
    name: PLUGIN_NAME
  }

  /**
   * Write output files if rollup is not.
   *
   * @see https://rollupjs.org/plugin-development/#generatebundle
   *
   * @async
   *
   * @this {PluginContext}
   *
   * @param {NormalizedOutputOptions} options
   *  Normalized output options
   * @param {OutputBundle} bundle
   *  Output bundle
   * @param {boolean} isWrite
   *  Rollup writing output files?
   * @return {Promise<undefined>}
   */
  async function generateBundle(
    this: PluginContext,
    options: NormalizedOutputOptions,
    bundle: OutputBundle,
    isWrite: boolean
  ): Promise<undefined> {
    ok(typeof options.fs === 'object', 'expected `options.fs`')
    ok(typeof options.root === 'string', 'expected `options.root`')
    ok(typeof options.write === 'boolean', 'expected `options.write`')

    if (!isWrite && options.root && options.write) {
      for (const output of Object.values(bundle)) {
        /**
         * Absolute path to output file.
         *
         * @const {string} path
         */
        const path: string = pathe.join(
          options.root,
          fallback(options.dir, ''),
          output.fileName
        )

        /**
         * Output file contents.
         *
         * @const {string} contents
         */
        const contents: string = 'code' in output
          ? output.code
          : String(output.source)

        await options.fs.mkdir(pathe.dirname(path), { recursive: true })
        await options.fs.writeFile(path, contents)
      }
    }

    return void this
  }
}
