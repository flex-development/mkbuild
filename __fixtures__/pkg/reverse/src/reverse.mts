/**
 * @file reverse
 * @module fixtures/pkg/reverse/reverse
 * @see https://leetcode.com/problems/reverse-integer
 */

import MAX_VALUE from '#fixtures/pkg/reverse/src/max-value'
import MIN_VALUE from '#fixtures/pkg/reverse/src/min-value'

/**
 * Given a signed 32-bit integer, `x`, the function returns `x` with its digits
 * reversed. If reversing `x` causes the value to go outside the signed 32-bit
 * integer range, `0` will be returned instead.
 *
 * @example reverse(3) // 3
 * @example reverse(-4) // -4
 * @example reverse(123) // 321
 * @example reverse(-123) // -321
 * @example reverse(120) // 21
 * @example reverse(1534236469) // 0
 *
 * @param {number} x - Integer to reverse
 * @return {number} `x` with its digits reversed
 */
function reverse(x: number): number {
  // If x is between -9 and 9, return x
  if (x >= -9 && x <= 9) return x

  /** @const {string} s - `x` stringified */
  const s: string = x.toString()

  /** @const {number} r - `x` reversed */
  const r: number = Number.parseInt([...s, x < 0 ? '-' : ''].reverse().join(''))

  return r < MIN_VALUE || r > MAX_VALUE ? 0 : r
}

export default reverse
