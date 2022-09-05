/**
 * @file Utilities - resolveSpecifier
 * @module mkbuild/utils/resolveSpecifier
 */

import { resolvePath } from 'mlly'
import * as pathe from 'pathe'
import { MODULE_EXTENSIONS } from 'src/config/constants'
import type { BuildEntry, OutputFile, Statement } from 'src/interfaces'

/**
 * Resolves a relative specifier in `statement.code` and `statement.specifier`.
 *
 * A relative specifier, like `'./startup.js'` or `'../config.mjs'`, refers to a
 * path relative to the location of the importing file.
 *
 * Unless `NODE_OPTIONS` is being used to control specifier resolution, the file
 * extension is always necessary when using esm.
 *
 * @see https://nodejs.org/docs/latest-v16.x/api/esm.html#terminology
 *
 * @async
 *
 * @param {Pick<Statement, 'code' | 'specifier'>} statement - Statement object
 * @param {Pick<BuildEntry, 'ext' | 'format'>} entry - Build entry
 * @param {BuildEntry['ext']} [entry.ext] - Build entry extension
 * @param {BuildEntry['format']} [entry.format] - Build entry format
 * @param {OutputFile['src']} src - Full path to output source file
 * @return {Promise<void>} Nothing when complete
 */
const resolveSpecifier = async (
  statement: Pick<Statement, 'code' | 'specifier'>,
  entry: Pick<BuildEntry, 'ext' | 'format'>,
  src: OutputFile['src']
): Promise<void> => {
  /**
   * {@link statement} specifier before module path resolution.
   *
   * @const {string | undefined} specifier
   */
  const specifier: string | undefined = statement.specifier

  // do nothing if missing entry extension, entry format, or module specifier
  if (!entry.ext || !entry.format || !specifier) return

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
    conditions: [entry.format === 'esm' ? 'import' : 'require'],
    extensions: MODULE_EXTENSIONS,
    url: src
  })

  const { name } = pathe.parse(specifier)
  const { name: resolved_name } = pathe.parse(resolved)

  // specifier resolved to a directory
  if (name !== resolved_name) statement.specifier += '/' + resolved_name

  // add build entry extension to specifier
  statement.specifier += entry.ext

  // reset statement code
  statement.code = statement.code.replace(specifier, statement.specifier!)

  return void statement
}

export default resolveSpecifier
