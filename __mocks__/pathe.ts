/**
 * @file Mocks - pathe
 * @module mocks/pathe
 * @see https://github.com/unjs/pathe
 */

import path, { type FormatInputPathObject } from 'node:path'

/**
 * Return the last portion of `p`.
 *
 * @param {string} p - Path to evaluate
 * @return {string} File name
 */
export const basename = vi.fn((p: string): string => path.basename(p))

/**
 * Returns the directory name of `p`.
 *
 * @param {string} p - Path to evaluate
 * @return {string} Directory containing `p`
 */
export const dirname = vi.fn((p: string): string => path.dirname(p))

/**
 * Returns the extension of `p`, from the last `'.'` to end of string in the
 * last portion of the path.
 *
 * If there is no `'.'` in the last portion of the path or the first character
 * of it is `'.'`, an empty string will be returned.
 *
 * @param {string} p - Path to evaluate
 * @return {string} Extension of `p`
 */
export const extname = vi.fn((p: string) => path.extname(p))

/**
 * Returns a path string from an object - the opposite of {@link parse}.
 *
 * @param {FormatInputPathObject} p - Path object to evaluate
 * @return {path.ParsedPath} Object representing `p` parsed
 */
export const format = vi.fn((p: FormatInputPathObject) => path.format(p))

/**
 * Parses `p`.
 *
 * @param {string} p - Path to evaluate
 * @return {path.ParsedPath} Object representing `p` parsed
 */
export const parse = vi.fn((p: string) => path.parse(p))

/**
 * Returns the relative path from `from` to `to` based on the current working
 * directory.
 *
 * @param {string} from - Start path
 * @param {string} to - Destination path
 * @return {string} Relative path from `from` to `to`
 */
export const relative = vi.fn((from: string, to: string): string => {
  return path.relative(from, to)
})

/**
 * Starting from leftmost {from} parameter, resolves {to} to an absolute path.
 *
 * @param {string[]} paths - Path segments
 * @return {string} Absolute path composed from `paths`
 */
export const resolve = vi.fn((...paths: string[]): string => {
  return path.resolve(...paths)
})
