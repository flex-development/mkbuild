/**
 * @file Integration Tests - fully-specified plugin
 * @module mkbuild/plugins/fully-specified/tests/integration
 */

import ESBUILD_OPTIONS from '#fixtures/esbuild-options'
import extractStatements from '#src/utils/extract-statements'
import {
  build,
  type BuildFailure,
  type BuildOptions,
  type Plugin
} from 'esbuild'
import Module from 'node:module'
import testSubject from '../plugin'

vi.mock('../../../utils/extract-statements')

describe('integration:plugins/fully-specified', () => {
  let options: BuildOptions
  let subject: Plugin

  beforeEach(() => {
    subject = testSubject()
    options = { ...ESBUILD_OPTIONS, logLevel: 'silent', plugins: [subject] }
  })

  describe('esbuild', () => {
    describe('messages', () => {
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
    })

    describe('noop', () => {
      it('should do nothing if bundling', async () => {
        // Act
        await build({
          ...options,
          bundle: true,
          entryPoints: ['__fixtures__/reverse.mts'],
          external: Module.builtinModules.flatMap(m => [m, 'node:' + m]),
          format: 'esm',
          loader: { '.mts': 'ts' },
          outExtension: { '.js': '.mjs' }
        })

        // Expect
        expect(extractStatements).toHaveBeenCalledTimes(0)
      })

      it('should skip files that are not javascript', async () => {
        // Act
        const { outputFiles } = await build({
          ...options,
          entryPoints: ['__fixtures__/apple-stock.jsonc'],
          loader: { '.jsonc': 'copy' }
        })

        // Expect
        expect(outputFiles).to.be.an('array').of.length(1)
        expect(outputFiles![0]!.text).toMatchSnapshot()
      })

      it('should skip files that are not typescript', async () => {
        // Act
        const { outputFiles } = await build({
          ...options,
          entryPoints: ['__fixtures__/bitcoin-price.json5'],
          loader: { '.json5': 'copy' }
        })

        // Expect
        expect(outputFiles).to.be.an('array').of.length(1)
        expect(outputFiles![0]!.text).toMatchSnapshot()
      })
    })

    describe('specifiers', () => {
      it('should fill specifiers in copied files', async () => {
        // Act
        const { outputFiles } = await build({
          ...options,
          entryPoints: ['__fixtures__/my-atoi.d.mts'],
          format: 'esm',
          loader: { '.d.mts': 'copy' },
          outExtension: { '.js': '.mjs' }
        })

        // Expect
        expect(outputFiles).to.be.an('array').of.length(1)
        expect(outputFiles![0]!.text).toMatchSnapshot()
      })

      it('should fill specifiers in transpiled cjs files', async () => {
        // Act
        const { outputFiles } = await build({
          ...options,
          entryPoints: ['__fixtures__/relative-specifiers.cts'],
          format: 'cjs',
          loader: { '.cts': 'ts' },
          outExtension: { '.js': '.cjs' }
        })

        // Expect
        expect(outputFiles![0]!.text).toMatchSnapshot()
      })

      it('should fill specifiers in transpiled esm files', async () => {
        // Act
        const { outputFiles } = await build({
          ...options,
          entryPoints: ['__fixtures__/relative-specifiers.mts'],
          format: 'esm',
          loader: { '.mts': 'ts' },
          outExtension: { '.js': '.mjs' }
        })

        // Expect
        expect(outputFiles![0]!.text).toMatchSnapshot()
      })
    })
  })
})
