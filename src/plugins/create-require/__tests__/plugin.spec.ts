/**
 * @file Unit Tests - create-require plugin
 * @module mkbuild/plugins/create-require/tests/unit
 */

import createPluginAPI from '#tests/utils/create-plugin-api'
import type { BuildOptions, Plugin, PluginBuild } from 'esbuild'
import * as esbuild from 'esbuild'
import testSubject from '../plugin'

vi.mock('esbuild')

describe('unit:plugins/create-require', () => {
  let subject: Plugin

  beforeEach(() => {
    subject = testSubject()
  })

  it('should do nothing if bundling is not enabled', async () => {
    // Arrange
    const initialOptions: BuildOptions = { bundle: false }
    const api: PluginBuild = createPluginAPI({ initialOptions })

    // Act
    await subject.setup(api)

    // Expect
    expect(esbuild.transform).toHaveBeenCalledTimes(0)
    expect(api.onEnd).toHaveBeenCalledTimes(0)
  })

  it('should do nothing if not creating esm bundle', async () => {
    // Arrange
    const initialOptions: BuildOptions = { bundle: true, format: 'cjs' }
    const api: PluginBuild = createPluginAPI({ initialOptions })

    // Act
    await subject.setup(api)

    // Expect
    expect(esbuild.transform).toHaveBeenCalledTimes(0)
    expect(api.onEnd).toHaveBeenCalledTimes(0)
  })
})
