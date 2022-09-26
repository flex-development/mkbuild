/**
 * @file Mock Plugins - fully-specified
 * @module mkbuild/plugins/fully-specified/mocks/plugin
 */

import type { Plugin } from 'esbuild'

export default vi
  .fn((): Plugin => ({ name: 'fully-specified', setup: vi.fn() }))
  .mockName('fullySpecified')
