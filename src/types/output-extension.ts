/**
 * @file Type Definitions - OutputExtension
 * @module mkbuild/types/OutputExtension
 */

import type { EmptyString } from '@flex-development/tutils'

/**
 * Output file extensions.
 */
type OutputExtension = `${EmptyString | '.'}${EmptyString | 'min.'}${
  | 'cjs'
  | 'js'
  | 'mjs'}`

export type { OutputExtension as default }
