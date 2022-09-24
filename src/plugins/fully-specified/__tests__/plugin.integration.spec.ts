/**
 * @file Integration Tests - fully-specified plugin
 * @module mkbuild/plugins/fully-specified/tests/integration
 */

import ESBUILD_OPTIONS from '#fixtures/esbuild-options'
import { build, type BuildOptions, type Plugin } from 'esbuild'
import testSubject from '../plugin'

describe('integration:plugins/fully-specified', () => {
  let options: BuildOptions
  let subject: Plugin

  beforeEach(() => {
    subject = testSubject()
    options = { ...ESBUILD_OPTIONS, logLevel: 'silent', plugins: [subject] }
  })

  describe('esbuild', () => {
    it('should fill specifiers in cjs output files', async () => {
      // Act
      const { errors, outputFiles, warnings } = await build({
        ...options,
        entryPoints: ['__fixtures__/relative-specifiers.cts'],
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

    it('should fill specifiers in copied output files', async () => {
      // Act
      const { errors, outputFiles, warnings } = await build({
        ...options,
        entryPoints: ['__fixtures__/my-atoi.d.mts'],
        format: 'esm',
        loader: { '.d.mts': 'copy' },
        outExtension: { '.js': '.mjs' }
      })

      // Expect
      expect(errors).to.be.an('array').of.length(0)
      expect(warnings).to.be.an('array').of.length(0)
      expect(outputFiles).to.be.an('array').of.length(1)
      expect(outputFiles![0]!.text).toMatchSnapshot()
    })

    it('should fill specifiers in esm output files', async () => {
      // Act
      const { errors, outputFiles, warnings } = await build({
        ...options,
        entryPoints: ['__fixtures__/relative-specifiers.mts'],
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
        entryPoints: ['__fixtures__/bitcoin-price.json5'],
        loader: { '.json5': 'copy' }
      })

      // Expect
      expect(errors).to.be.an('array').of.length(0)
      expect(warnings).to.be.an('array').of.length(0)
      expect(outputFiles).to.be.an('array').of.length(1)
      expect(outputFiles![0]!.text).toMatchSnapshot()
    })
  })
})
