/**
 * @file Config - Constants
 * @module mkbuild/config/constants
 */

import { builtinModules } from 'node:module'

/**
 * Built-in modules.
 *
 * @const {string[]} BUILTIN_MODULES
 */
export const BUILTIN_MODULES: string[] = builtinModules.flatMap(m => {
  return [m, 'node:' + m]
})

/**
 * `require` and `require.resolve` statement regex.
 *
 * @todo prevent matching non-statements (e.g. comments, arbitrary strings)
 *
 * @const {RegExp} EVAL_CJS_REGEX
 */
export const EVAL_CJS_REGEX: RegExp =
  /(?:require\(|require\.resolve\()["']([^"']*)["']\)/g

/**
 * Declaration file extension regex.
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

/**
 * Resolvable file extensions.
 *
 * @see https://esbuild.github.io/api/#resolve-extensions
 *
 * @const {string[]} RESOLVE_EXTENSIONS
 */
export const RESOLVE_EXTENSIONS: string[] = [
  '.cjs',
  '.css',
  '.cts',
  '.js',
  '.json',
  '.jsx',
  '.mjs',
  '.mts',
  '.ts',
  '.tsx'
]
