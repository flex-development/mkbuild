/**
 * @file Snapshot Serializers - Result[]
 * @module tests/setup/serializers/result-array
 */

import type { Result } from '#src/interfaces'
import {
  isNIL,
  isNull,
  isNumber,
  isObjectPlain,
  isString
} from '@flex-development/tutils'
import pf from 'pretty-format'
import { get, pick } from 'radash'

expect.addSnapshotSerializer({
  /**
   * Prints the given `value`.
   *
   * @param {unknown} value - Value to print
   * @return {string} `value` as printable string
   */
  print(value: unknown): string {
    value = (value as Result[]).map(result => {
      result.path = result.path.replace(/.*?(?=\/__.+)/, '${process.cwd()}')
      return pick(result, [
        'entryPoint',
        'errors',
        'outfile',
        'path',
        'warnings'
      ])
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
    return Array.isArray(value)
      ? value.every(item => {
          return (
            isNumber(get(item, 'bytes')) &&
            !isNIL(get(item, 'contents')) &&
            (isString(get(item, 'entryPoint')) ||
              isNull(get(item, 'entryPoint'))) &&
            Array.isArray(get(item, 'errors')) &&
            Array.isArray(get(item, 'exports')) &&
            Array.isArray(get(item, 'imports')) &&
            isObjectPlain(get(item, 'inputs')) &&
            isString(get(item, 'outfile')) &&
            isString(get(item, 'path')) &&
            isString(get(item, 'text')) &&
            Array.isArray(get(item, 'warnings'))
          )
        })
      : false
  }
})
