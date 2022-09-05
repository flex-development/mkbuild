/**
 * @file Config - Constants
 * @module mkbuild/config/constants
 */

/**
 * Module extensions checked when attempting to resolve path aliases and module
 * specifiers.
 *
 * @const {string[]} MODULE_EXTENSIONS
 */
export const MODULE_EXTENSIONS: string[] = [
  '.cjs',
  '.cts',
  '.js',
  '.json',
  '.jsx',
  '.mdx',
  '.mjs',
  '.mts',
  '.ts',
  '.tsx'
]
