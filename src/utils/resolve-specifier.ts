/**
 * @file Utilities - resolveSpecifier
 * @module mkbuild/utils/resolveSpecifier
 */

import { MODULE_EXTENSIONS } from '#src/config/constants'
import type { Entry, Statement } from '#src/interfaces'
import { resolvePath } from 'mlly'
import * as pathe from 'pathe'

/**
 * Adds a file extension to a relative specifier.
 *
 * A relative specifier, like `'./startup.js'` or `'../config.mjs'`, refers to a
 * path relative to the location of the importing file.
 *
 * Unless [`--experimental-specifier-resolution=node`][1] is used to customize
 * the ESM specifier resolution algorithm, file extensions are required.
 *
 * [1]: https://nodejs.org/docs/latest-v16.x/api/esm.html#customizing-esm-specifier-resolution-algorithm
 *
 * @see https://nodejs.org/docs/latest-v16.x/api/esm.html#terminology
 *
 * @async
 *
 * @param {Omit<Statement, 'type'>} statement - Statement object
 * @param {string} source - Absolute path to source file
 * @param {Entry['format']} [format='esm'] - Output file format
 * @param {Entry['ext']} [ext] - Output file extension
 * @param {string[]} [extensions=MODULE_EXTENSIONS] - Resolvable extensions
 * @return {Promise<void>} Nothing when complete
 */
const resolveSpecifier = async (
  statement: Omit<Statement, 'type'>,
  source: string,
  format: Entry['format'] = 'esm',
  ext: Entry['ext'] = format === 'esm' ? '.mjs' : '.js',
  extensions: string[] = MODULE_EXTENSIONS
): Promise<void> => {
  /**
   * {@link statement} specifier before module path resolution.
   *
   * @const {string | undefined} specifier
   */
  const specifier: string | undefined = statement.specifier

  // do nothing if missing module specifier
  if (!specifier) return

  // do nothing if specifier is not relative or already has extension
  if (!specifier.startsWith('.') || pathe.extname(specifier)) return

  /**
   * {@link statement.specifier} resolved.
   *
   * @see https://github.com/unjs/mlly#resolvepath
   *
   * @const {string} resolved
   */
  const resolved: string = await resolvePath(specifier, {
    conditions: [format === 'esm' ? 'import' : 'require'],
    extensions,
    url: source
  })

  const { name } = pathe.parse(specifier)
  const { name: resolved_name } = pathe.parse(resolved)

  // specifier resolved to a directory
  if (name !== resolved_name) statement.specifier += '/' + resolved_name

  // add build output extension to specifier
  statement.specifier += ext

  // reset statement code and end index of code
  statement.code = statement.code.replace(specifier, statement.specifier!)
  statement.end = statement.start + statement.code.length

  return void statement
}

export default resolveSpecifier
