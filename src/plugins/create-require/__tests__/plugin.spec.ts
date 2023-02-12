/**
 * @file Unit Tests - create-require plugin
 * @module mkbuild/plugins/create-require/tests/unit
 */

import createPluginAPI from '#tests/utils/create-plugin-api'
import * as esbuild from 'esbuild'
import testSubject from '../plugin'

vi.mock('esbuild')

describe('unit:plugins/create-require', () => {
  let subject: esbuild.Plugin

  beforeEach(() => {
    subject = testSubject()
  })

  it('should do nothing if bundling is not enabled', async () => {
    // Arrange
    const api: esbuild.PluginBuild = createPluginAPI({
      initialOptions: { bundle: false }
    })

    // Act
    await subject.setup(api)

    // Expect
    expect(esbuild.transform).toHaveBeenCalledTimes(0)
    expect(api.onEnd).toHaveBeenCalledTimes(0)
  })

  it('should do nothing if not creating esm bundle', async () => {
    // Arrange
    const api: esbuild.PluginBuild = createPluginAPI({
      initialOptions: { bundle: true, format: 'cjs' }
    })

    // Act
    await subject.setup(api)

    // Expect
    expect(esbuild.transform).toHaveBeenCalledTimes(0)
    expect(api.onEnd).toHaveBeenCalledTimes(0)
  })

  it('should throw if esbuild is writing output files', async () => {
    // Arrange
    let error: Error

    // Act
    try {
      await subject.setup(
        createPluginAPI({
          initialOptions: { bundle: true, format: 'esm', write: true }
        })
      )
    } catch (e: unknown) {
      error = e as typeof error
    }

    // Expect
    expect(error!).to.not.be.undefined
    expect(error!).to.have.property('message').equal('write must be disabled')
  })

  it('should throw if metafile is disabled', async () => {
    // Arrange
    let error: Error

    // Act
    try {
      await subject.setup(
        createPluginAPI({
          initialOptions: { bundle: true, format: 'esm' }
        })
      )
    } catch (e: unknown) {
      error = e as typeof error
    }

    // Expect
    expect(error!).to.not.be.undefined
    expect(error!).to.have.property('message').equal('metafile required')
  })
})
