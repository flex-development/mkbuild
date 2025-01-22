/**
 * @file Utilities - defineBuildConfig
 * @module mkbuild/utils/defineBuildConfig
 */

import type { Config } from '@flex-development/mkbuild'

/**
 * Helper for defining a build configuration object.
 *
 * @see {@linkcode Config}
 *
 * @category
 *  utils
 *
 * @this {void}
 *
 * @param {Config | null | undefined} [config]
 *  Build configuration
 * @return {Config}
 *  Build configuration
 */
function defineBuildConfig(
  this: void,
  config?: Config | null | undefined
): Config {
  return config ?? {}
}

export default defineBuildConfig
