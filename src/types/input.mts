/**
 * @file Type Aliases - Input
 * @module mkbuild/types/Input
 */

import type { InputFile, InputList, InputMap } from '@flex-development/mkbuild'

/**
 * Union of build entry points.
 *
 * @see {@linkcode InputFile}
 * @see {@linkcode InputList}
 * @see {@linkcode InputMap}
 */
type Input = InputFile | InputList | InputMap

export type { Input as default }
