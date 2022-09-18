/**
 * @file Mock Plugins - dts
 * @module mkbuild/plugins/dts/mocks/plugin
 */

import type { Plugin } from 'esbuild'

export default vi
  .fn((): Plugin => ({ name: 'dts', setup: vi.fn() }))
  .mockName('dts')
