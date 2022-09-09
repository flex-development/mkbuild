/**
 * @file Utilities - resolveAlias
 * @module mkbuild/utils/resolveAlias
 */

import type { Statement } from '#src/interfaces'
import * as pathe from 'pathe'

/**
 * Resolves a path alias in `statement.code` and `statement.specifier`.
 *
 * @param {Omit<Statement, 'type'>} statement - Statement object
 * @param {string} match - Possible path match
 * @param {string} source - Absolute path to source file
 * @return {void} Nothing when complete
 */
const resolveAlias = (
  statement: Omit<Statement, 'type'>,
  match: string,
  source: string
): void => {
  // do nothing if missing module specifier or path match
  if (!statement.specifier || !match) return

  // remove node_modules reference or set match to relative path from src
  match = /\/node_modules\//.test(match)
    ? match.replace(/.+\/node_modules\//, '')
    : pathe.relative(pathe.dirname(source), match).replace(/^(\w)/, './$1')

  // reset statement code, end index of code, and specifier
  statement.code = statement.code.replace(statement.specifier, match)
  statement.end = statement.start + statement.code.length
  statement.specifier = match
}

export default resolveAlias
