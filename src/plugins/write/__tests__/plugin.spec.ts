/**
 * @file Unit Tests - write plugin
 * @module mkbuild/plugins/tests/unit/write
 */

import createPluginAPI from '#tests/utils/create-plugin-api'
import type * as esbuild from 'esbuild'
import testSubject from '../plugin'

describe('unit:plugins/write', () => {
  let subject: esbuild.Plugin

  beforeEach(() => {
    subject = testSubject()
  })

  it('should throw if esbuild is writing output files', async () => {
    // Arrange
    let error: Error

    // Act
    try {
      await subject.setup(createPluginAPI({ initialOptions: { write: true } }))
    } catch (e: unknown) {
      error = e as typeof error
    }

    // Expect
    expect(error!).to.not.be.undefined
    expect(error!.message).to.equal('write must be disabled')
  })
})
