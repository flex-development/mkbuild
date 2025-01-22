/**
 * @file Plugins - metadata
 * @module mkbuild/plugins/metadata
 */

import { ksort } from '@flex-development/tutils'
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
const PLUGIN_NAME: string = 'mkbuild:metadata'

plugin.PLUGIN_NAME = PLUGIN_NAME
export default plugin

/**
 * Create a build metadata plugin.
 *
 * @see {@linkcode Plugin}
 *
 * @internal
 *
 * @this {void}
 *
 * @return {Plugin}
 *  Build metadata plugin
 */
function plugin(this: void): Plugin {
  return { generateBundle, name: PLUGIN_NAME }

  /**
   * Attach additional metadata to output assets and chunks.
   *
   * @see https://rollupjs.org/plugin-development/#generatebundle
   *
   * @this {PluginContext}
   *
   * @param {NormalizedOutputOptions} options
   *  Normalized output options
   * @param {OutputBundle} bundle
   *  Output bundle
   * @return {undefined}
   */
  function generateBundle(
    this: PluginContext,
    options: NormalizedOutputOptions,
    bundle: OutputBundle
  ): undefined {
    for (const output of Object.values(bundle)) {
      /**
       * Output file contents.
       *
       * @const {Uint8Array | string} contents
       */
      const contents: Uint8Array | string = 'code' in output
        ? output.code
        : output.source

      output.bytes = Buffer.byteLength(contents)
      ksort(output)
    }

    return void this
  }
}
