/**
 * @file Integration Tests - fully-specified plugin
 * @module mkbuild/plugins/fully-specified/tests/integration
 */

import ESBUILD_OPTIONS from '#fixtures/esbuild-options'
import {
  build,
  type BuildFailure,
  type BuildOptions,
  type Plugin
} from 'esbuild'
import testSubject from '../plugin'

describe('integration:plugins/fully-specified', () => {
  let options: BuildOptions
  let subject: Plugin

  beforeEach(() => {
    subject = testSubject()
    options = {
      ...ESBUILD_OPTIONS,
      entryPoints: ['__fixtures__/relative-specifiers.ts'],
      format: 'esm',
      outExtension: { '.js': '.mjs' },
      plugins: [subject]
    }
  })

  describe('esbuild', () => {
    it('should send error message if metafile is not enabled', async () => {
      // Arrange
      let failure: BuildFailure

      // Act
      try {
        await build({ ...options, metafile: false })
      } catch (e: unknown) {
        failure = e as BuildFailure
      }

      // Expect
      expect(failure!).to.have.keys(['errors', 'warnings'])
      expect(failure!.errors).toMatchSnapshot()
    })

    it('should add file extensions to relative specifiers', async () => {
      expect((await build(options)).outputFiles![0]!.text).toMatchSnapshot()
    })
  })
})
