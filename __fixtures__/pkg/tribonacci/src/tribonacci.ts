/**
 * @file tribonacci
 * @module fixtures/pkg/tribonacci/tribonacci
 * @see https://codewars.com/kata/556deca17c58da83c00002db
 */

/**
 * Starting sequence.
 */
type Sequence = [a: number, b: number, c: number]

/**
 * Given a starting sequence, `[a, b, c]`, the function returns an array with
 * the first `n` elements of the sequence.
 *
 * @example
 *  tribonacci([0, 0, 1], 10) // [0, 0, 1, 1, 2, 4, 7, 13, 24, 44]
 * @example
 *  tribonacci([1, 1, 1], 10) // [1, 1, 1, 3, 5, 9, 17, 31, 57, 105]
 *
 * @param {Sequence} seq
 *  Starting sequence
 * @param {number} n
 *  Total number of elements to include in sequence
 * @return {number[]}
 *  First `n` elements of sequence
 */
function tribonacci(seq: Sequence, n: number): number[] {
  // base case: n is less than or equal to zero
  if (n <= 0) return []

  /**
   * Sum of {@linkcode a}, {@linkcode b}, and {@linkcode c}.
   *
   * @const {number} sum
   */
  const sum: number = seq[0] + seq[1] + seq[2]

  return [seq[0], ...tribonacci([seq[1], seq[2], sum], n - 1)]
}

export default tribonacci
