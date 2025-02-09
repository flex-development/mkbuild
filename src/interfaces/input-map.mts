/**
 * @file Interfaces - InputMap
 * @module mkbuild/interfaces/InputMap
 */

import type { InputFile } from '@flex-development/mkbuild'

/**
 * Record, where each key is an entry point name and each value is an entry
 * point file.
 *
 * @see {@linkcode InputFile}
 */
interface InputMap {
  [input: string]: InputFile
}

export type { InputMap as default }
