/**
 * @file Interfaces - ResolveIdOptions
 * @module mkbuild/interfaces/ResolveIdOptions
 */

import type { CustomPluginOptions } from 'rollup'

/**
 * Options passed to the `resolveId` hook.
 *
 * @see https://rollupjs.org/plugin-development/#resolveid
 */
interface ResolveIdOptions {
  /**
   * Import attributes that were present in the import.
   */
  attributes: Record<string, string>

  /**
   * Custom plugin options.
   *
   * @see {@linkcode CustomPluginOptions}
   */
  custom?: CustomPluginOptions | undefined

  /**
   * Boolean indicating if a user defined entry point or emitted chunk is being
   * resolved, or the `isEntry` parameter was provided to the
   * [`this.resolve context`][resolve] function.
   *
   * [resolve]: https://rollupjs.org/plugin-development/#this-resolve
   */
  isEntry: boolean
}

export type { ResolveIdOptions as default }
