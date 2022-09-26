/**
 * @file Unit Tests - fully-specified plugin
 * @module mkbuild/plugins/fully-specified/tests/unit
 */

import createPluginAPI from '#tests/utils/create-plugin-api'
import { type BuildOptions, type Plugin, type PluginBuild } from 'esbuild'
import testSubject from '../plugin'

describe('unit:plugins/fully-specified', () => {
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
