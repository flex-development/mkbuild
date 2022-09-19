/**
 * @file Type Definitions - OutputExtension
 * @module mkbuild/types/OutputExtension
 */

/**
 * Output file extensions.
 */
type OutputExtension = `${'.min' | ''}${'.cjs' | '.js' | '.mjs'}`

export type { OutputExtension as default }
