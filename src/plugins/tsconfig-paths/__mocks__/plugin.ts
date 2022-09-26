/**
 * @file Mock Plugins - tsconfig-paths
 * @module mkbuild/plugins/tsconfig-paths/mocks/plugin
 */

import type { Plugin } from 'esbuild'

export default vi
  .fn((): Plugin => ({ name: 'tsconfig-paths', setup: vi.fn() }))
  .mockName('tsconfigPaths')
