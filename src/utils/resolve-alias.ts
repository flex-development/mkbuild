/**
 * @file Utilities - resolveAlias
 * @module mkbuild/utils/resolveAlias
 */

import * as pathe from 'pathe'
import { MODULE_EXTENSIONS } from 'src/config/constants'
import type { OutputFile, Statement } from 'src/interfaces'
import type { MatchPath } from 'tsconfig-paths'

/**
 * Resolves a path alias in `statement.code` and `statement.specifier`.
 *
 * @param {Pick<Statement, 'code' | 'specifier'>} statement - Statement object
 * @param {OutputFile['src']} src - Full path to output source file
 * @param {MatchPath} matcher - Path matching function
 * @return {void} Nothing when complete
 */
const resolveAlias = (
  statement: Pick<Statement, 'code' | 'specifier'>,
  src: OutputFile['src'],
  matcher: MatchPath
): void => {
  // do nothing if missing module specifier
  if (!statement.specifier) return

  /**
   * Possible path alias match for {@link specifier}.
   *
   * @const {string | undefined} match
   */
  let match: string | undefined = matcher(
    statement.specifier,
    undefined,
    undefined,
    MODULE_EXTENSIONS
  )

  // resolve path match
  if (match) {
    // remove node_modules reference or set match to relative path from src
    match = /\/node_modules\//.test(match)
      ? match.replace(/.+\/node_modules\//, '')
      : pathe.relative(pathe.dirname(src), match).replace(/^(\w)/, './$1')

    // reset statement code and specifier
    statement.code = statement.code.replace(statement.specifier, match)
    statement.specifier = match
  }
}

export default resolveAlias
