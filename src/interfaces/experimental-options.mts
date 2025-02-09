/**
 * @file Interfaces - ExperimentalOptions
 * @module mkbuild/interfaces/ExperimentalOptions
 */

import type { Result } from '@flex-development/mkbuild'

/**
 * Experimental options.
 *
 * @see https://rollupjs.org/configuration-options/#experimental-options
 */
interface ExperimentalOptions {
  /**
   * After how many runs cached assets that are no longer used by plugins should
   * be removed.
   *
   * @default 10
   */
  cacheExpiry?: number | null | undefined

  /**
   * Log the first side effect found in every file to the console. This can
   * be very helpful to figure which files have side effects and what the actual
   * side effects are. Removing side effects can improve tree-shaking and chunk
   * generation and is crucial to make {@linkcode minChunkSize} work.
   *
   * @default false
   */
  logSideEffects?: boolean | null | undefined

  /**
   * Minimal chunk size target (in bytes) for code-splitting setups.
   *
   * @see https://rollupjs.org/configuration-options/#output-experimentalminchunksize
   *
   * @default 1
   */
  minChunkSize?: number | null | undefined

  /**
   * Whether to collect performance timings.
   *
   * When enabled, the `timings` key of a build task {@linkcode Result} will be
   * an object where each value is a list of performance times.
   *
   * For each key, the first number represents the elapsed time, the second the
   * change in memory consumption, and the third represents the total memory
   * consumption after this step.
   * The order of these steps is the order used by `Object.keys`.
   * Top level keys start with `#` and contain the timings of nested steps, i.e.
   * in the example below, the `698ms` of the `# BUILD` step include the `538ms`
   * of the `## parse modules` step.
   *
   * @example
   *  {
   *    "# BUILD": [ 698.020877, 33979632, 45328080 ],
   *    "## parse modules": [ 537.509342, 16295024, 27660296 ],
   *    "load modules": [ 33.253778999999994, 2277104, 38204152 ]
   *  }
   */
  perf?: boolean | null | undefined
}

export type { ExperimentalOptions as default }
