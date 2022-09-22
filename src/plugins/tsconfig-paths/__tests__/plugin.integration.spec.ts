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
      const { outputFiles = [] } = await build({
        ...options,
        entryPoints: ['__fixtures__/tsconfig-paths.cts'],
        format: 'cjs',
        loader: { '.cts': 'ts' },
        outExtension: { '.js': '.cjs' }
      })

      // Expect
      expect(outputFiles[0]!.text).toMatchSnapshot()
    })

    it('should resolve path aliases in copied output files', async () => {
      // Act
      const { outputFiles = [] } = await build({
        ...options,
        entryPoints: ['__fixtures__/values.d.ts'],
        format: 'esm',
        loader: { '.d.ts': 'copy' }
      })

      // Expect
      expect(outputFiles[0]!.text).toMatchSnapshot()
    })

    it('should resolve path aliases esm output files', async () => {
      // Act
      const { outputFiles = [] } = await build({
        ...options,
        entryPoints: ['__fixtures__/tsconfig-paths.mts'],
        format: 'esm',
        loader: { '.mts': 'ts' },
        outExtension: { '.js': '.mjs' }
      })

      // Expect
      expect(outputFiles[0]!.text).toMatchSnapshot()
    })

    it('should skip files that are not javascript or typescript', async () => {
      // Act
      const { outputFiles = [] } = await build({
        ...options,
        entryPoints: ['__fixtures__/apple-stock.jsonc'],
        loader: { '.jsonc': 'copy' }
      })

      // Expect
      expect(outputFiles[0]!.text).toMatchSnapshot()
    })
  })
})
