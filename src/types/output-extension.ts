/**
 * @file Type Definitions - OutputExtension
 * @module mkbuild/types/OutputExtension
 */

import type { Dot, EmptyString } from '@flex-development/tutils'

/**
 * Output file extensions.
 */
type OutputExtension = `${Dot | EmptyString}${EmptyString | `min${Dot}`}${
  | 'cjs'
  | 'js'
  | 'mjs'}`

export type { OutputExtension as default }
