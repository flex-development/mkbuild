/**
 * @file Interfaces - Flags
 * @module mkbuild/interfaces/Flags
 */

import type { Omit } from '@flex-development/tutils'
import type Options from './options'

/**
 * CLI options.
 *
 * @extends {Omit<Options,'nodePaths'>}
 */
interface Flags extends Omit<Options, 'nodePaths'> {
  /**
   * Print help text.
   */
  help?: boolean

  /**
   * Print version number.
   */
  version?: boolean

  /**
   * Watch files.
   *
   * @default false
   */
  watch?: boolean
}

export type { Flags as default }
