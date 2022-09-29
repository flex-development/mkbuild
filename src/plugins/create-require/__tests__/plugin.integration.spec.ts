/**
 * @file Integration Tests - create-require plugin
 * @module mkbuild/plugins/create-require/tests/integration
 */

import ESBUILD_OPTIONS from '#fixtures/esbuild-options'
import { build, type BuildOptions, type Plugin } from 'esbuild'
import dedent from 'ts-dedent'
import testSubject from '../plugin'

describe('integration:plugins/create-require', () => {
  let options: BuildOptions
  let subject: Plugin

  beforeEach(() => {
    subject = testSubject()
    options = {
      ...ESBUILD_OPTIONS,
      bundle: true,
      format: 'esm',
      outbase: '__fixtures__',
      platform: 'node',
      plugins: [subject]
    }
  })

  describe('esbuild', () => {
    it('should insert require function definition', async () => {
      // Act
      const {
        errors,
        outputFiles = [],
        warnings
      } = await build({
        ...options,
        banner: {
          js: dedent`
            /**
             * @file Virtual File System
             * @module vfs
             * @see https://github.com/streamich/memfs
             */
          `
        },
        entryPoints: ['__fixtures__/volume.ts'],
        loader: { '.ts': 'ts' }
      })

      // Expect
      expect(errors).to.be.an('array').of.length(0)
      expect(warnings).to.be.an('array').of.length(0)
      expect(outputFiles).to.be.an('array').of.length(1)
      expect(outputFiles[0]!.text.split('var __commonJS')[0]).toMatchSnapshot()
    })

    it('should skip files without __require shim', async () => {
      // Act
      const {
        errors,
        outputFiles = [],
        warnings
      } = await build({
        ...options,
        entryPoints: ['__fixtures__/reverse.mts'],
        loader: { '.mts': 'ts' }
      })

      // Expect
      expect(errors).to.be.an('array').of.length(0)
      expect(warnings).to.be.an('array').of.length(0)
      expect(outputFiles).to.be.an('array').of.length(1)
      expect(outputFiles[0]!.text).toMatchSnapshot()
    })
  })
})
