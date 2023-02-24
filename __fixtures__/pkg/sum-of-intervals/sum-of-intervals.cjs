/**
 * @file sumOfIntervals (cjs)
 * @module fixtures/pkg/sum-of-intervals/cjs
 * @see https://codewars.com/kata/52b7ed099cdc285c300001cd
 */

/**
 * Given an array of intervals, all of varying lengths, the function returns the
 * sum of all interval lengths.
 *
 * **Overlapping intervals will be counted once**.
 *
 * @example
 *  sumOfIntervals([[1, 5]]) // 4
 * @example
 *  sumOfIntervals([[1, 4], [7, 10], [3, 5]]) // 7
 * @example
 *  sumOfIntervals([[1, 5], [10, 15], [-1, 3]]) // 11
 *
 * @param {[number, number][]} intervals - Intervals
 * @return {number} Sum of all interval lengths
 */
const sumOfIntervals = intervals => {
  // Return array length if array is empty
  if (intervals.length === 0) return intervals.length

  // If intervals array only has one interval, do simple math
  if (intervals.length === 1) return intervals[0][1] - intervals[0][0]

  // Sort intervals array
  intervals = intervals.sort((a, b) => a[0] - b[0])

  /** @var {number} sum - Sum of intervals in {@linkcode intervals} */
  let sum = 0

  // Calculate sum
  for (let i = 0; i < intervals.length; i++) {
    /** @const {[number, number] | undefined} prev - Previous interval */
    const prev = intervals[i - 1]

    // Bounds of current interval
    const [, b2] = intervals[i]
    let [b1] = intervals[i]

    // If bounds are within prev, remove previous interval
    // Otherwise, add difference in bounds to sum
    if (prev && b1 >= prev[0] && b2 <= prev[1]) {
      intervals.splice((i -= 1) + 1, 1)
    } else {
      // Replace lower bound of current interval if within previous interval
      if (prev && b1 >= prev[0] && b1 <= prev[1]) b1 = prev[1]

      // Add difference in bounds to sum
      sum += b2 - b1
    }
  }

  return sum
}

module.exports = sumOfIntervals
