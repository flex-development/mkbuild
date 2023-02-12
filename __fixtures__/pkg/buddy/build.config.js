/**
 * @file Build Config Fixture - buddy
 * @module fixtures/pkg/buddy/build.config
 */

export default {
  bundle: true,
  cwd: '__fixtures__/pkg/buddy',
  entries: [{ format: 'esm' }, { format: 'cjs' }],
  name: 'index',
  platform: 'neutral',
  source: 'buddy.js',
  sourcemap: true,
  sourcesContent: false
}
