/**
 * @file Test Utilities - createPluginAPI
 * @module tests/utils/createPluginAPI
 */

import * as esbuild from 'esbuild'

/**
 * Creates an [esbuild plugin API][1] object.
 *
 * [1]: https://esbuild.github.io/plugins
 *
 * @param {Partial<esbuild.PluginBuild>} [overrides={}] - API overrides
 * @return {esbuild.PluginBuild} Mock [plugin API][1] object
 */
const createPluginAPI = ({
  initialOptions = {},
  onDispose = vi.fn(),
  onEnd = vi.fn(),
  onLoad = vi.fn(),
  onResolve = vi.fn(),
  onStart = vi.fn(),
  resolve = vi.fn()
}: Partial<esbuild.PluginBuild> = {}): esbuild.PluginBuild => ({
  esbuild,
  initialOptions,
  onDispose,
  onEnd,
  onLoad,
  onResolve,
  onStart,
  resolve
})

export default createPluginAPI
