/**
 * @file Utilities - extractStatements
 * @module mkbuild/utils/extractStatements
 */

import type { Format } from 'esbuild'
import { findDynamicImports, findExports, findStaticImports } from 'mlly'
import { REQUIRE_REGEX } from 'src/config/constants'
import type { Statement } from 'src/interfaces'

/**
 * Returns an array containing `export`, `import`, and/or `require` statements
 * in `contents`.
 *
 * If `format` is `esm`, the returned array will contain `export` statements, as
 * well as dynamic and static `import` statements. Otherwise, the returned array
 * will contain `require` and dynamic `import` statements.
 *
 * @param {string} [code=''] - Code to extract statements from
 * @param {Format} [format='esm'] - `code` format
 * @return {Statement[]} `import`, `export`, and `require` statements
 */
const extractStatements = (
  code: string = '',
  format: Format = 'esm'
): Statement[] => {
  if (!code) return []

  /**
   * ESM format check.
   *
   * @const {boolean} esm
   */
  const esm: boolean = format === 'esm'

  /**
   * Import, export, and require statements.
   *
   * @const {Statement[]} statements
   */
  const statements: Statement[] = [
    ...findDynamicImports(code),
    ...(esm ? findExports(code) : []),
    ...(esm ? findStaticImports(code) : [])
  ].map(obj => ({
    code: obj.code,
    end: obj.end,
    specifier: obj.type === 'dynamic' ? obj.expression : obj.specifier,
    start: obj.start,
    type: obj.type
  }))

  // push require statements
  if (!esm) {
    for (const match of code.matchAll(REQUIRE_REGEX)) {
      const { 0: code, 1: specifier, index } = match

      statements.push({
        code: code!,
        end: index! + code!.length,
        specifier: specifier!,
        start: index!,
        type: /require\.resolve\(["']\w+["']\)/.test(code!)
          ? 'require.resolve'
          : 'require'
      })
    }
  }

  return statements
}

export default extractStatements
