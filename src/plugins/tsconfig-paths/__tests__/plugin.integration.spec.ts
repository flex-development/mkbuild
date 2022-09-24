/**
 * @file Integration Tests - tsconfig-paths plugin
 * @module mkbuild/plugins/tsconfig-paths/tests/integration
 */

import ESBUILD_OPTIONS from '#fixtures/esbuild-options'
import { build, type BuildOptions, type Plugin } from 'esbuild'
import testSubject from '../plugin'

describe('integration:plugins/tsconfig-paths', () => {
  let options: BuildOptions
  let subject: Plugin

  beforeEach(() => {
    subject = testSubject()
    options = { ...ESBUILD_OPTIONS, logLevel: 'silent', plugins: [subject] }
  })

  describe('esbuild', () => {
    it('should resolve path aliases in cjs output files', async () => {
      // Act
      const { errors, outputFiles, warnings } = await build({
        ...options,
        entryPoints: ['__fixtures__/tsconfig-paths.cts'],
        format: 'cjs',
        loader: { '.cts': 'ts' },
        outExtension: { '.js': '.cjs' }
      })

      // Expect
      expect(errors).to.be.an('array').of.length(0)
      expect(warnings).to.be.an('array').of.length(0)
      expect(outputFiles).to.be.an('array').of.length(1)
      expect(outputFiles![0]!.text).toMatchSnapshot()
    })

    it('should resolve path aliases in copied output files', async () => {
      // Act
      const { errors, outputFiles, warnings } = await build({
        ...options,
        entryPoints: ['__fixtures__/values.d.ts'],
        format: 'esm',
        loader: { '.d.ts': 'copy' }
      })

      // Expect
      expect(errors).to.be.an('array').of.length(0)
      expect(warnings).to.be.an('array').of.length(0)
      expect(outputFiles).to.be.an('array').of.length(1)
      expect(outputFiles![0]!.text).toMatchSnapshot()
    })

    it('should resolve path aliases esm output files', async () => {
      // Act
      const { errors, outputFiles, warnings } = await build({
        ...options,
        entryPoints: ['__fixtures__/tsconfig-paths.mts'],
        format: 'esm',
        loader: { '.mts': 'ts' },
        outExtension: { '.js': '.mjs' }
      })

      // Expect
      expect(errors).to.be.an('array').of.length(0)
      expect(warnings).to.be.an('array').of.length(0)
      expect(outputFiles).to.be.an('array').of.length(1)
      expect(outputFiles![0]!.text).toMatchSnapshot()
    })

    it('should skip files that are not javascript or typescript', async () => {
      // Act
      const { errors, outputFiles, warnings } = await build({
        ...options,
        entryPoints: ['__fixtures__/apple-stock.jsonc'],
        loader: { '.jsonc': 'copy' }
      })

      // Expect
      expect(errors).to.be.an('array').of.length(0)
      expect(warnings).to.be.an('array').of.length(0)
      expect(outputFiles).to.be.an('array').of.length(1)
      expect(outputFiles![0]!.text).toMatchSnapshot()
    })
  })
})
