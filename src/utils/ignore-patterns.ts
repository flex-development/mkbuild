/**
 * @file Utilities - IGNORE_PATTERNS
 * @module mkbuild/utils/IGNORE_PATTERNS
 */

/**
 * Default ignore patterns.
 *
 * @see https://github.com/mrmlnc/fast-glob#ignore
 *
 * @const {Set<string>} IGNORE_PATTERNS
 */
const IGNORE_PATTERNS: Set<string> = new Set<string>([
  '**/*.mdx',
  '**/*.stories.*',
  '**/.*ignore',
  '**/.*rc',
  '**/.*rc.*',
  '**/.DS_*',
  '**/.codecov.yml',
  '**/.cspell.json',
  '**/.dictionary.txt',
  '**/.editorconfig',
  '**/.env*',
  '**/.git*',
  '**/Brewfile',
  '**/__mocks__',
  '**/__snapshots__',
  '**/__tests__',
  '**/build.config.*',
  '**/package-lock.json',
  '**/package.json',
  '**/tsconfig*.json',
  '**/vitest-env.*',
  '**/vitest.config.*',
  '**/yarn.lock'
])

export default IGNORE_PATTERNS
