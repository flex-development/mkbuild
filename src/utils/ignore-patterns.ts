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
  '**/**.mdx',
  '**/**.stories.*',
  '**/.*ignore',
  '**/.*rc',
  '**/.DS_Store',
  '**/.env*',
  '**/.git*',
  '**/__mocks__/**',
  '**/__snapshots__/**',
  '**/__tests__/**',
  '**/coverage/**',
  '**/package-lock.json',
  '**/yarn.lock'
])

export default IGNORE_PATTERNS
