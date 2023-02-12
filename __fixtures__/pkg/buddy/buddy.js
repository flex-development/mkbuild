/**
 * @file buddy
 * @module fixtures/pkg/buddy/buddy
 * @see https://codewars.com/kata/59ccf051dcc4050f7800008f
 */

/**
 * The divisors of positive integer `n` are said to be `proper` when considering
 * divisors other than `n` itself.
 *
 * Let `s(n)` be the sum of `proper` divisors of `n`. Call `buddy` two positive
 * integers such that the sum` of the `proper` divisors of each number is one
 * more than the other number:
 *
 * `[n, m]` are `buddy` if `s(m) = n + 1` and `s(n) = m + 1`
 *
 * Given two positive integers, `start` and `limit`, the function returns the
 * first pair of `buddy pairs` such that `start <= n <= limit` and `m > n`.
 *
 * @example
 *  buddy(2382, 3679) // []
 * @example
 *  buddy(10, 50) // [48, 75]
 * @example
 *  buddy(48, 50) // [48, 75]
 * @example
 *  buddy(1071625, 1103735) // [1081184, 1331967]
 *
 * @param {number} start - Lower bound (inclusive)
 * @param {number} limit - Upper bound (inclusive)
 * @return {[] | [number, number]} First pair of `buddy pairs`
 */
const buddy = (start, limit) => {
  /**
   * Returns the sum of `proper` divisors of `int`.
   *
   * @param {number} int - Integer to get `proper` divisors for
   * @return {number} Sum of `proper` divisors of `int`
   */
  const s = int => {
    /** @var {number} sum - Sum of `proper` divisors of {@link int} */
    let sum = 1

    // Calculate sum of proper divisors
    for (let d = 2; d <= Math.sqrt(int); d++) {
      // If d is divisible by int, increase sum
      // If divisors d and int/d are equal, add divisor once. Otherwise add both
      if (int % d === 0) sum += d + (d === int / d ? 0 : int / d)
    }

    return sum
  }

  // Find first buddy pair
  for (let n = start; n <= limit; n++) {
    /** @const {number} m - Possible `m` value */
    const m = s(n) - 1

    // If m satisfies constraint, return buddy pair
    if (s(m) === n + 1 && m > n) return [n, m]
  }

  // If buddy pair wasn't found, return empty array
  return []
}

export default buddy
