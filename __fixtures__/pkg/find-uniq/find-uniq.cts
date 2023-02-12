/**
 * @file findUniq
 * @module fixtures/pkg/find-uniq/findUniq
 * @see https://codewars.com/kata/585d7d5adb20cf33cb000235
 */

/**
 * Given an array of numbers, `arr`, the function returns the unique element in
 * the array, if found.
 *
 * @example
 *  findUniq([]) // null
 * @example
 *  findUniq([1]) // null
 * @example
 *  findUniq([1, 2]) // null
 * @example
 *  findUniq([3, 3, 3]) // null
 * @example
 *  findUniq([1, 1, 1, 2, 1, 1]) // 2
 * @example
 *  findUniq([0, 0, 0.55, 0, 0]) // 0.55
 * @example
 *  findUniq([0, 1, 1, 1, 1, 1, 1, 1]) // 0
 *
 * @param {number[]} arr - Number array
 * @return {number | null} Unique element in `arr` or `null`
 */
const findUniq = (arr: number[]): number | null => {
  // If array has less than 3 elements, or every element is the same, do nothing
  if (arr.length < 3 || arr.every(el => el === arr[0])) return null

  // Find unique element
  return arr.reduce<number | null>((u, el, i) => {
    return u === null && arr[i - 1] !== el && !arr.includes(el, i + 1) ? el : u
  }, null)
}

export default findUniq
