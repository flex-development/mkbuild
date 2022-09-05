/**
 * @file Utilities - resolveAliases
 * @module mkbuild/utils/resolveAliases
 */

import type { BuildOptions, OutputFile, Statement } from 'src/interfaces'
import type { ConfigLoaderResult, MatchPath } from 'tsconfig-paths'
import resolveAlias from './resolve-alias'

/**
 * Resolves path aliases in `output.contents`.
 *
 * @see https://github.com/dividab/tsconfig-paths
 *
 * @async
 *
 * @param {Pick<OutputFile, 'contents' | 'src'>} output - Output file object
 * @param {string | undefined} [output.contents] - Output file content
 * @param {string} output.src - Full path to source file
 * @param {Pick<Statement, 'code' | 'specifier'>[]} [statements=[]] - `import`,
 * `require`, and `export` statements in `output.contents`
 * @param {BuildOptions['cwd']} [cwd=process.cwd()] - Root project directory
 * @return {Promise<void>} Nothing when complete
 */
const resolveAliases = async (
  output: Pick<OutputFile, 'contents' | 'src'>,
  statements: Pick<Statement, 'code' | 'specifier'>[] = [],
  cwd: BuildOptions['cwd'] = process.cwd()
): Promise<void> => {
  if (!output.contents || statements.length === 0) return

  const { createMatchPath, loadConfig } = await import('tsconfig-paths')

  /**
   * `tsconfig-paths` config loader result.
   *
   * @const {ConfigLoaderResult} tsconfig
   */
  const tsconfig: ConfigLoaderResult = loadConfig(cwd)

  if (tsconfig.resultType === 'success') {
    /**
     * Matches a path alias.
     *
     * @const {MatchPath} matcher
     */
    const matcher: MatchPath = createMatchPath(
      tsconfig.absoluteBaseUrl,
      tsconfig.paths,
      tsconfig.mainFields,
      tsconfig.addMatchAll
    )

    for (const statement of statements) {
      /**
       * {@link statement.code} before path alias replacement.
       *
       * @const {string} code
       */
      const code: string = statement.code

      // resolve path alias
      resolveAlias(statement, output.src, matcher)

      // replace code in output content
      output.contents = output.contents.replace(code, statement.code)
    }
  }

  return void output.contents
}

export default resolveAliases
