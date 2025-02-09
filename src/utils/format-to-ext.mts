/**
 * @file Utilities - formatToExt
 * @module mkbuild/utils/formatToExt
 */

import type { Format } from '@flex-development/mkbuild'
import type { Ext } from '@flex-development/pathe'

/**
 * Get a file extension for a module `format`.
 *
 * @see {@linkcode Ext}
 * @see {@linkcode Format}
 *
 * @category
 *  utils
 *
 * @this {void}
 *
 * @param {Format} format
 *  Module format
 * @return {Ext}
 *  File extension for `format`
 */
function formatToExt(this: void, format: Format): Ext {
  // note: if more module formats are added, the switch statement below will
  // result in a lint error (@typescript-eslint/switch-exhaustiveness-check)
  switch (format) {
    case 'cjs':
      return '.cjs'
    case 'esm':
      return '.mjs'
    case 'iife':
    case 'system':
    case 'umd':
      return '.js'
  }
}

export default formatToExt
