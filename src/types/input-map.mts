/**
 * @file Type Aliases - InputMap
 * @module mkbuild/types/InputMap
 */

import type { InputFile } from '@flex-development/mkbuild'

/**
 * An object mapping names to entry point files.
 *
 * @see {@linkcode InputFile}
 */
type InputMap = Record<string, InputFile>

export type { InputMap as default }
