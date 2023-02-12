/**
 * @file Build Config Fixture - sum-of-intervals
 * @module fixtures/pkg/sum-of-intervals/build.config
 */

export default {
  cwd: '__fixtures__/pkg/sum-of-intervals',
  entries: [
    { format: 'esm', pattern: 'sum-of-intervals.mjs' },
    { format: 'cjs', pattern: 'sum-of-intervals.cjs' }
  ],
  source: '.',
  sourcemap: true,
  sourcesContent: false
}
