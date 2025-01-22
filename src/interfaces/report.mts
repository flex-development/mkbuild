/**
 * @file Interfaces - Report
 * @module mkbuild/interfaces/Report
 */

import type { Result } from '@flex-development/mkbuild'

/**
 * Build report.
 */
interface Report {
  /**
   * Build results.
   *
   * @see {@linkcode Result}
   */
  builds: Result[]

  /**
   * Get the total build size.
   *
   * @return {number}
   *  Total build size in bytes
   */
  get size(): number
}

export type { Report as default }
