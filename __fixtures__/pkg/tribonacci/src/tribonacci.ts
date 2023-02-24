/**
 * @file tribonacci
 * @module fixtures/pkg/tribonacci/tribonacci
 * @see https://codewars.com/kata/556deca17c58da83c00002db
 */

/**
 * Given a starting sequence, `[a, b, c]`, the function returns an array with
 * the first `n` elements of the sequence.
 *
 * @example
 *  tribonacci([0, 0, 1], 10) // [0, 0, 1, 1, 2, 4, 7, 13, 24, 44]
 * @example
 *  tribonacci([1, 1, 1], 10) // [1, 1, 1, 3, 5, 9, 17, 31, 57, 105]
 *
 * @param {[number, number, number]} args - Starting sequence
 * @param {number} n - Total number of elements in sequence
 * @return {number[]} First `n` elements of sequence
 */
const tribonacci = (
  [a, b, c]: [number, number, number],
  n: number
): number[] => {
  // base case: n is less than or equal to zero
  if (n <= 0) return []

  /**
   * Sum of {@linkcode a}, {@linkcode b}, and {@linkcode c}.
   *
   * @const {number} sum
   */
  const sum: number = a + b + c

  return [a, ...tribonacci([b, c, sum], n - 1)]
}

export default tribonacci
