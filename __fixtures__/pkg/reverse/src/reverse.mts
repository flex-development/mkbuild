/**
 * @file reverse
 * @module fixtures/pkg/reverse/reverse
 * @see https://leetcode.com/problems/reverse-integer
 */

import MAX_VALUE from './max-value.mts'
import MIN_VALUE from './min-value.mts'

/**
 * Given a signed 32-bit integer, `x`, the function returns `x` with its digits
 * reversed. If reversing `x` causes the value to go outside the signed 32-bit
 * integer range, `0` will be returned instead.
 *
 * @example
 *  reverse(3) // 3
 * @example
 *  reverse(-4) // -4
 * @example
 *  reverse(123) // 321
 * @example
 *  reverse(-123) // -321
 * @example
 *  reverse(120) // 21
 * @example
 *  reverse(1534236469) // 0
 *
 * @param {number} x
 *  The integer to reverse
 * @return {number}
 *  Number representing the digits of `x` reversed
 */
function reverse(x: number): number {
  if (x >= -9 && x <= 9) return x

  /**
   * Digit list.
   *
   * @const {string[]} digits
   */
  const digits: string[] = [...x.toString(), x < 0 ? '-' : '']

  /**
   * {@linkcode x} reversed.
   *
   * @const {string} reversed
   */
  const reversed: number = Number.parseInt(digits.reverse().join(''))

  return reversed < MIN_VALUE || reversed > MAX_VALUE ? 0 : reversed
}

export default reverse
