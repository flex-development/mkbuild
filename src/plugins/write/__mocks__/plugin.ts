/**
 * @file Mock Plugins - write
 * @module mkbuild/plugins/write/mocks/plugin
 */

import type { Plugin } from 'esbuild'

export default vi
  .fn((): Plugin => ({ name: 'write', setup: vi.fn() }))
  .mockName('write')
