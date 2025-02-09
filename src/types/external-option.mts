/**
 * @file Type Aliases - ExternalOption
 * @module mkbuild/types/ExternalOption
 */

import type { IsExternal } from '@flex-development/mkbuild'

/**
 * Union of values used to mark modules as external.
 *
 * @see {@linkcode IsExternal}
 */
type ExternalOption = (RegExp | string)[] | IsExternal | RegExp | string

export type { ExternalOption as default }
