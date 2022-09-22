/**
 * @file Unit Tests - dts plugin
 * @module mkbuild/plugins/dts/tests/unit
 */

import createPluginAPI from '#tests/utils/create-plugin-api'
import type { Plugin, PluginBuild } from 'esbuild'
import testSubject from '../plugin'

describe('unit:plugins/dts', () => {
  let subject: Plugin

  beforeEach(() => {
    subject = testSubject()
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

  it('should do nothing if no source files are found', async () => {
    // Arrange
    const api: PluginBuild = createPluginAPI({
      initialOptions: {
        entryPoints: { 'apple-stock': '__fixtures__/apple-stock.jsonc' },
        metafile: true
      }
    })

    // Act
    await subject.setup(api)

    // Expect
    expect(api.onEnd).toHaveBeenCalledTimes(0)
  })
})
