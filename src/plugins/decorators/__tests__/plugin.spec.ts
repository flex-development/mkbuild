/**
 * @file Unit Tests - decorators plugin
 * @module mkbuild/plugins/tests/unit/decorators
 */

import createPluginAPI from '#tests/utils/create-plugin-api'
import pathe from '@flex-development/pathe'
import type * as esbuild from 'esbuild'
import testSubject from '../plugin'

describe('unit:plugins/decorators', () => {
  let subject: esbuild.Plugin

  beforeEach(() => {
    subject = testSubject()
  })

  it('should do nothing if emitDecoratorMetadata is not enabled', async () => {
    // Arrange
    const api: esbuild.PluginBuild = createPluginAPI({
      initialOptions: {
        absWorkingDir: pathe.resolve('__fixtures__/pkg/dbl-linear')
      }
    })

    // Act
    await subject.setup(api)

    // Expect
    expect(api.onLoad).toHaveBeenCalledTimes(0)
  })
})
