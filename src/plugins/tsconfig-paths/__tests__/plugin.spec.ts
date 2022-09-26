/**
 * @file Unit Tests - tsconfig-paths plugin
 * @module mkbuild/plugins/tsconfig-paths/tests/unit
 */

import createPluginAPI from '#tests/utils/create-plugin-api'
import type { BuildOptions, Plugin, PluginBuild } from 'esbuild'
import { createMatchPath } from 'tsconfig-paths'
import testSubject from '../plugin'

vi.mock('tsconfig-paths')

describe('unit:plugins/tsconfig-paths', () => {
  let subject: Plugin

  beforeEach(() => {
    subject = testSubject()
  })

  it('should do nothing if bundling', async () => {
    // Arrange
    const bundle: BuildOptions['bundle'] = true
    const api: PluginBuild = createPluginAPI({ initialOptions: { bundle } })

    // Act
    await subject.setup(api)

    // Expect
    expect(createMatchPath).toHaveBeenCalledTimes(0)
    expect(api.onEnd).toHaveBeenCalledTimes(0)
  })

  it('should throw if metafile is not available', async () => {
    // Arrange
    const api: PluginBuild = createPluginAPI()
    let error: Error

    // Act
    try {
      await subject.setup(api)
    } catch (e: unknown) {
      error = e as Error
    }

    // Expect
    expect(error!).to.not.be.undefined
    expect(error!.message).to.equal('metafile required')
  })
})
