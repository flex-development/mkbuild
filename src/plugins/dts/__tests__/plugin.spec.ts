/**
 * @file Unit Tests - dts plugin
 * @module mkbuild/plugins/tests/unit/dts
 */

import createPluginAPI from '#tests/utils/create-plugin-api'
import { cast } from '@flex-development/tutils'
import type * as esbuild from 'esbuild'
import testSubject from '../plugin'

describe('unit:plugins/dts', () => {
  let subject: esbuild.Plugin

  beforeEach(() => {
    subject = testSubject()
  })

  it('should do nothing if bundling', async () => {
    // Arrange
    const api: esbuild.PluginBuild = createPluginAPI({
      initialOptions: { bundle: true }
    })

    // Act
    await subject.setup(api)

    // Expect
    expect(api.onResolve).toHaveBeenCalledTimes(0)
    expect(api.onEnd).toHaveBeenCalledTimes(0)
  })

  it('should throw if esbuild is writing output files', async () => {
    // Arrange
    let error!: Error

    // Act
    try {
      await subject.setup(createPluginAPI({ initialOptions: { write: true } }))
    } catch (e: unknown) {
      error = cast(e)
    }

    // Expect
    expect(error).to.have.property('message', 'write must be disabled')
  })

  it('should throw if metafile is disabled', async () => {
    // Arrange
    let error!: Error

    // Act
    try {
      await subject.setup(createPluginAPI())
    } catch (e: unknown) {
      error = cast(e)
    }

    // Expect
    expect(error).to.have.property('message', 'metafile required')
  })
})
