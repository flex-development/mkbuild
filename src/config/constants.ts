/**
 * @file Config - Constants
 * @module mkbuild/config/constants
 */

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

/**
 * Module extensions checked when attempting to resolve path aliases and module
 * specifiers.
 *
 * @const {string[]} MODULE_EXTENSIONS
 */
export const MODULE_EXTENSIONS: string[] = [
  '.cjs',
  '.cts',
  '.js',
  '.json',
  '.jsx',
  '.mdx',
  '.mjs',
  '.mts',
  '.ts',
  '.tsx'
]

/**
 * `require` and `require.resolve` statement regex.
 *
 * @todo prevent matching non-statements (e.g. comments, arbitrary strings)
 *
 * @const {RegExp} REQUIRE_REGEX
 */
export const REQUIRE_REGEX: RegExp =
  /(?:require\(|require\.resolve\()["']([^"']*)["']\)/g
