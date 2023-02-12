/**
 * @file Build Config Fixture - reverse
 * @module fixtures/pkg/reverse/build.config
 */

import * as mlly from '@flex-development/mlly'

export default {
  conditions: mlly.CONDITIONS,
  cwd: '__fixtures__/pkg/reverse',
  sourcemap: true,
  sourcesContent: false,
  tsconfig: 'tsconfig.json'
}
