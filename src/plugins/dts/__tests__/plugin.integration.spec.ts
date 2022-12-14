/**
 * @file Integration Tests - dts plugin
 * @module mkbuild/plugins/dts/tests/integration
 */

import ESBUILD_OPTIONS from '#fixtures/esbuild-options'
import { build, type BuildOptions, type Plugin } from 'esbuild'
import path from 'node:path'
import { pick } from 'radash'
import testSubject from '../plugin'

describe('integration:plugins/dts', () => {
  let options: BuildOptions
  let subject: Plugin

  beforeEach(() => {
    subject = testSubject()
    options = {
      ...ESBUILD_OPTIONS,
      logLevel: 'silent',
      outbase: '__fixtures__',
      plugins: [subject],
      sourcemap: true
    }
  })

  describe('esbuild', () => {
    it('should add .d.cts output', async () => {
      // Act
      const {
        errors,
        outputFiles = [],
        warnings
      } = await build({
        ...options,
        entryPoints: ['__fixtures__/my-atoi.cts'],
        format: 'cjs',
        loader: { '.cts': 'ts' },
        outExtension: { '.js': '.cjs' }
      })
      outputFiles[2]!.path = path.format({
        dir: ESBUILD_OPTIONS.outdir,
        name: path.basename(outputFiles[2]!.path)
      })

      // Expect
      expect(errors).to.be.an('array').of.length(0)
      expect(warnings).to.be.an('array').of.length(0)
      expect(outputFiles).to.be.an('array').of.length(3)
      expect(pick(outputFiles[2]!, ['path', 'text'])).toMatchSnapshot()
    })

    it('should add .d.cts output for copied file', async () => {
      // Act
      const {
        errors,
        outputFiles = [],
        warnings
      } = await build({
        ...options,
        entryPoints: ['__fixtures__/sum-of-intervals.cjs'],
        format: 'cjs',
        loader: { '.cjs': 'copy' },
        outExtension: { '.js': '.cjs' }
      })
      outputFiles[1]!.path = path.format({
        dir: ESBUILD_OPTIONS.outdir,
        name: path.basename(outputFiles[1]!.path)
      })

      // Expect
      expect(errors).to.be.an('array').of.length(0)
      expect(warnings).to.be.an('array').of.length(0)
      expect(outputFiles).to.be.an('array').of.length(2)
      expect(pick(outputFiles[1]!, ['path', 'text'])).toMatchSnapshot()
    })

    it('should add .d.mts output', async () => {
      // Act
      const {
        errors,
        outputFiles = [],
        warnings
      } = await build({
        ...options,
        entryPoints: ['__fixtures__/reverse.mts'],
        format: 'esm',
        loader: { '.mts': 'ts' },
        outExtension: { '.js': '.mjs' }
      })
      outputFiles[2]!.path = path.format({
        dir: ESBUILD_OPTIONS.outdir,
        name: path.basename(outputFiles[2]!.path)
      })

      // Expect
      expect(errors).to.be.an('array').of.length(0)
      expect(warnings).to.be.an('array').of.length(0)
      expect(outputFiles).to.be.an('array').of.length(3)
      expect(pick(outputFiles[2]!, ['path', 'text'])).toMatchSnapshot()
    })

    it('should add .d.mts output for copied file', async () => {
      // Act
      const {
        errors,
        outputFiles = [],
        warnings
      } = await build({
        ...options,
        entryPoints: ['__fixtures__/sum-of-intervals.mjs'],
        format: 'esm',
        loader: { '.mjs': 'copy' },
        outExtension: { '.js': '.mjs' }
      })
      outputFiles[1]!.path = path.format({
        dir: ESBUILD_OPTIONS.outdir,
        name: path.basename(outputFiles[1]!.path)
      })

      // Expect
      expect(errors).to.be.an('array').of.length(0)
      expect(warnings).to.be.an('array').of.length(0)
      expect(outputFiles).to.be.an('array').of.length(2)
      expect(pick(outputFiles[1]!, ['path', 'text'])).toMatchSnapshot()
    })

    it('should add .d.ts output', async () => {
      // Act
      const {
        errors,
        outputFiles = [],
        warnings
      } = await build({
        ...options,
        entryPoints: ['__fixtures__/dbl-linear.ts'],
        format: 'esm',
        loader: { '.ts': 'ts' }
      })
      outputFiles[2]!.path = path.format({
        dir: ESBUILD_OPTIONS.outdir,
        name: path.basename(outputFiles[2]!.path)
      })

      // Expect
      expect(errors).to.be.an('array').of.length(0)
      expect(warnings).to.be.an('array').of.length(0)
      expect(outputFiles).to.be.an('array').of.length(3)
      expect(pick(outputFiles[2]!, ['path', 'text'])).toMatchSnapshot()
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
