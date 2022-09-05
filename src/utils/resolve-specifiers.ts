/**
 * @file Utilities - resolveSpecifiers
 * @module mkbuild/utils/resolveSpecifiers
 */

import type { BuildEntry, OutputFile, Statement } from 'src/interfaces'
import resolveSpecifier from './resolve-specifier'

/**
 * Resolves relative specifiers in `output.contents`.
 *
 * @see {@link resolveSpecifier}
 *
 * @async
 *
 * @param {Pick<OutputFile, 'contents' | 'src'>} output - Output file object
 * @param {string | undefined} [output.contents] - Output file content
 * @param {string} output.src - Full path to source file
 * @param {Pick<BuildEntry, 'ext' | 'format'>} [entry={}] - Build entry
 * @param {BuildEntry['ext']} [entry.ext] - Build entry extension
 * @param {BuildEntry['format']} [entry.format] - Build entry format
 * @param {Pick<Statement, 'code' | 'specifier'>[]} [statements=[]] - `import`,
 * `require`, and `export` statements in `output.contents`
 * @return {Promise<void>} Nothing when complete
 */
const resolveSpecifiers = async (
  output: Pick<OutputFile, 'contents' | 'src'>,
  entry: Pick<BuildEntry, 'ext'> = {},
  statements: Pick<Statement, 'code' | 'specifier'>[] = []
): Promise<void> => {
  if (!output.contents || statements.length === 0) return

  /* c8 ignore next */
  for (const statement of statements) {
    /**
     * {@link statement.code} before module path resolution.
     *
     * @const {string} code
     */
    const code: string = statement.code

    // resolve module path
    await resolveSpecifier(statement, entry, output.src)

    // replace code in output content
    output.contents = output.contents.replace(code, statement.code)
  }

  return void output.contents
}

export default resolveSpecifiers
