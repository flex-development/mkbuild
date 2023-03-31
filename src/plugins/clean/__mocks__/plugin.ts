/**
 * @file Mock Plugins - clean
 * @module mkbuild/plugins/clean/mocks/plugin
 */

import type { Plugin } from 'esbuild'

export default vi
  .fn((): Plugin => ({ name: 'clean', setup: vi.fn() }))
  .mockName('clean')
