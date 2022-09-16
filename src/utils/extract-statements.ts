/**
 * @file Utilities - extractStatements
 * @module mkbuild/utils/extractStatements
 */

import { EVAL_CJS_REGEX } from '#src/config/constants'
import type { Statement } from '#src/interfaces'
import {
  detectSyntax,
  findDynamicImports,
  findExports,
  findStaticImports
} from 'mlly'

/**
 * Returns an array containing `export`, `import`, and/or `require` statements
 * in `contents`.
 *
 * If `format` is `esm`, the returned array will contain `export` statements, as
 * well as dynamic and static `import` statements. Otherwise, the returned array
 * will contain `require` and dynamic `import` statements.
 *
 * @param {string} [code=''] - Code to extract statements from
 * @return {Statement[]} `import`, `export`, and `require` statements
 */
const extractStatements = (code: string = ''): Statement[] => {
  if (!code) return []

  const { hasCJS, hasESM } = detectSyntax(code)

  /**
   * Import, export, and require statements.
   *
   * @const {Statement[]} statements
   */
  const statements: Statement[] = [
    ...findDynamicImports(code),
    ...(hasESM ? findExports(code) : []),
    ...(hasESM ? findStaticImports(code) : [])
  ].map(obj => ({
    code: obj.code,
    end: obj.end,
    specifier:
      obj.type === 'dynamic'
        ? obj.expression.replace(/["']/g, '')
        : obj.specifier,
    start: obj.start,
    type: obj.type
  }))

  // push require statements
  if (hasCJS) {
    for (const match of code.matchAll(EVAL_CJS_REGEX)) {
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
