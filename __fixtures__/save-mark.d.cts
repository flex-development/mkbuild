/**
 * @file Fixtures - save-mark.d.cts
 * @module fixtures/save-mark.d.cts
 * @see https://codewars.com/kata/57fcadd2334ad3bbbc00023c
 */

/**
 * Returns the approximate distance between two pairs of coordinates.
 *
 * @example
 *  saveMark('48.23° N, 89.10° E', '48.84° N, 89.40° E') // '30KM'
 *
 * @param {string} c1 - First pair of coordinates
 * @param {string} c2 - Second pair of coordinates
 * @return {string} Approximate distance between `c1` and `c2` (in kilometers)
 */
declare function saveMark(c1: string, c2: string): number

export default saveMark
