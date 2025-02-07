/**
 * @file Interfaces - Failure
 * @module mkbuild/interfaces/Failure
 */

import type { Message } from '@flex-development/mkbuild'

/**
 * Build failure.
 *
 * @see {@linkcode Message}
 */
interface Failure extends Message {
  /**
   * Log level.
   *
   * @override
   */
  level: 'error'
}

export type { Failure as default }
