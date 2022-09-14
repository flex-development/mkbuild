/**
 * @file Fixtures - build.config.cts
 * @module fixtures/configs/build.config.cts
 */

import type { Config } from '#src'

export default {
  cwd: '__fixtures__/configs/cts',
  entries: [{ ext: '.cjs', format: 'cjs' }]
} as Config
