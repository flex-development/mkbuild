/**
 * @file Utilities - IGNORE_PATTERNS
 * @module mkbuild/utils/IGNORE_PATTERNS
 */

/**
 * Default ignore patterns.
 *
 * @category
 *  utils
 *
 * @const {Set<string>} IGNORE_PATTERNS
 */
const IGNORE_PATTERNS: Set<string> = new Set<string>([
  '**/.*ignore',
  '**/.*rc',
  '**/.*rc.*',
  '**/.DS_*',
  '**/.env*',
  '**/.git*',
  '**/.husky',
  '**/.vitest-reports',
  '**/.vscode',
  '**/.yarn',
  '**/Brewfile',
  '**/__mocks__',
  '**/__snapshots__',
  '**/__tests__',
  '**/build.config.*',
  '**/coverage',
  '**/node_modules/**',
  '**/package-lock.json',
  '**/package.json',
  '**/tsconfig*.json',
  '**/vitest.config.*',
  '**/yarn.lock'
])

export default IGNORE_PATTERNS
