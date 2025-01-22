/**
 * @file Test Utilities - createHasPlugin
 * @module tests/utils/createHasPlugin
 */

import { sift } from '@flex-development/tutils'
import type { InputPluginOption } from 'rollup'

export { createHasPlugin as default, type HasPlugin }

/**
 * Check if a list of input plugin options contains a specific plugin.
 *
 * @see {@linkcode InputPluginOption}
 *
 * @this {void}
 *
 * @param {InputPluginOption[]} plugins
 *  List of input plugin options
 * @return {boolean}
 *  `true` if `plugins` contains plugin with bounded plugin name
 */
type HasPlugin = (this: void, plugins: InputPluginOption[]) => boolean

/**
 * Create a function to check if a list of input plugin options contains a
 * plugin with the name `plugin`.
 *
 * @see {@linkcode HasPlugin}
 *
 * @this {void}
 *
 * @param {string} plugin
 *  Plugin name
 * @return {HasPlugin}
 *  Input plugin option list predicate
 */
function createHasPlugin(this: void, plugin: string): HasPlugin {
  return hasPlugin

  /**
   * @this {void}
   *
   * @param {InputPluginOption[]} plugins
   *  List of input plugin options
   * @return {boolean}
   *  `true` if `plugins` contains plugin with the name `plugin`
   */
  function hasPlugin(this: void, plugins: InputPluginOption[]): boolean {
    return sift(plugins).some(option => {
      return 'name' in option && option.name === plugin
    })
  }
}
