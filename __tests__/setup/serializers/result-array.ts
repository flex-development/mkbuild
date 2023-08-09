/**
 * @file Snapshot Serializers - Result[]
 * @module tests/setup/serializers/result-array
 */

import type { Result } from '#src/interfaces'
import {
  cast,
  get,
  isArray,
  isNIL,
  isObjectPlain,
  isString,
  omit,
  pick
} from '@flex-development/tutils'
import pf from 'pretty-format'

expect.addSnapshotSerializer({
  /**
   * Prints the given `value`.
   *
   * @param {unknown} value - Value to print
   * @return {string} `value` as printable string
   */
  print(value: unknown): string {
    value = cast<Result[]>(value).map(result => {
      result.cwd = result.cwd.replace(/.*?(?=\/__.+)/, '${process.cwd()}')

      return {
        ...omit(result, ['metafile']),
        outputs: result.outputs.map(output => {
          output.path = output.path.replace(/.*?(?=\/__.+)/, '${process.cwd()}')
          return pick(output, ['entryPoint', 'outfile', 'path'])
        })
      }
    })

    return pf(value, { printBasicPrototype: false })
  },
  /**
   * Checks if the given `value` is a {@linkcode Result} array.
   *
   * @param {unknown} value - Value to check
   * @return {value is Result[]} `true` if `value` is {@linkcode Result} array
   */
  test(value: unknown): value is Result[] {
    return isArray(value)
      ? value.every(item => {
          return (
            isString(get(item, 'cwd')) &&
            isArray(get(item, 'errors')) &&
            (isObjectPlain(get(item, 'mangleCache')) ||
              isNIL(get(item, 'mangleCache'))) &&
            isString(get(item, 'outdir')) &&
            isArray(get(item, 'outputs')) &&
            isArray(get(item, 'warnings'))
          )
        })
      : false
  }
})
