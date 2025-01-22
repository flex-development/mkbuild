/**
 * @file Type Aliases - SanitizeFileNameFn
 * @module mkbuild/types/SanitizeFileNameFn
 */

/**
 * Sanitize a chunk name.
 *
 * @this {void}
 *
 * @param {string} fileName
 *  The chunk file name to sanitize
 * @return {string}
 *  Sanitized file name
 */
type SanitizeFileNameFn = (this: void, fileName: string) => string

export type { SanitizeFileNameFn as default }
