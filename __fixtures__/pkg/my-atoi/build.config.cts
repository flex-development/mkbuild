/**
 * @file Build Config Fixture - my-atoi
 * @module fixtures/pkg/my-atoi/build.config
 */

import type { Config } from '#src'

export default {
  bundle: true,
  cwd: '__fixtures__/pkg/my-atoi',
  ext: '.js',
  format: 'cjs',
  name: 'index',
  platform: 'neutral',
  source: 'find-uniq.cts',
  sourcemap: true,
  sourcesContent: false,
  tsconfig: 'tsconfig.json'
} as Config
