/**
 * @file Config - Constants
 * @module mkbuild/config/constants
 */

/**
 * TypeScript declaration file extension regex.
 *
 * @const {RegExp} EXT_DTS_REGEX
 */
export const EXT_DTS_REGEX: RegExp = /\.d\.(c|m)?ts$/

/**
 * JavaScript file extension regex.
 *
 * @const {RegExp} EXT_JS_REGEX
 */
export const EXT_JS_REGEX: RegExp = /(\.(c|m)?js|jsx)$/

/**
 * TypeScript file extension regex.
 *
 * @const {RegExp} EXT_TS_REGEX
 */
export const EXT_TS_REGEX: RegExp = /(\.(c|m)?ts|tsx)$/

/**
 * Default ignore patterns.
 *
 * @see https://github.com/mrmlnc/fast-glob#ignore
 *
 * @const {string[]} IGNORE_PATTERNS
 */
export const IGNORE_PATTERNS: string[] = [
  '**/.DS_Store',
  '**/.npmignore',
  '**/.yarnignore',
  '**/**.mdx',
  '**/**.stories.{j,t}sx',
  '**/{__mocks__,__snapshots__,__tests__}/**'
]
