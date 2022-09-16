/**
 * @file Integration Tests - dts plugin
 * @module mkbuild/plugins/dts/tests/integration
 */

import ESBUILD_OPTIONS from '#fixtures/esbuild-options'
import {
  build,
  type BuildFailure,
  type BuildOptions,
  type Plugin
} from 'esbuild'
import path from 'node:path'
import { pick } from 'radash'
import testSubject from '../plugin'

describe('integration:plugins/dts', () => {
  let options: BuildOptions
  let subject: Plugin

  beforeEach(() => {
    subject = testSubject()
    options = { ...ESBUILD_OPTIONS, logLevel: 'silent', plugins: [subject] }
  })

  describe('esbuild', () => {
    describe('messages', () => {
      it('should send error if metafile is not enabled', async () => {
        // Arrange
        let failure: BuildFailure

        // Act
        try {
          await build({ ...options, metafile: false })
        } catch (e: unknown) {
          failure = e as BuildFailure
        }

        // Expect
        expect(failure!.errors).toMatchSnapshot()
      })

      it('should send warning if no source files are found', async () => {
        // Act
        const { warnings } = await build({
          ...options,
          entryPoints: { 'apple-stock': '__fixtures__/apple-stock.jsonc' },
          loader: { '.jsonc': 'copy' }
        })

        // Expect
        expect(warnings).toMatchSnapshot()
      })
    })

    describe('typescript declarations', () => {
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
    })
  })
})
