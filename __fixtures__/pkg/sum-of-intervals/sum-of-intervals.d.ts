declare module './sum-of-intervals' {
  /**
   * Given an array of intervals, all of varying lengths, the function returns
   * the sum of all interval lengths.
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
  const sumOfIntervals: (intervals: [number, number][]) => number

  export default sumOfIntervals
}
