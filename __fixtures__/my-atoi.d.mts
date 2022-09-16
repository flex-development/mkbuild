/**
 * @file Fixtures - my-atoi.d.mts
 * @module fixtures/my-atoi.d.mts
 */

/**
 * Converts a string, `s`, to a 32-bit signed integer (similar to C/C++'s `atoi`
 * function).
 *
 * @example myAtoi('') // 0
 * @example myAtoi('42') // 42
 * @example myAtoi('   -42') // -42
 * @example myAtoi('4193 with words') // 4193
 * @example myAtoi('words and 987') // 0
 * @example myAtoi('+-12') // 0
 *
 * @param {string} s - String to convert
 * @return {number} 32-bit signed integer
 */
declare function myAtoi(s: string): number

export default myAtoi

export { default as MAX_VALUE } from './max-value'
export { default as MIN_VALUE } from './min-value'
