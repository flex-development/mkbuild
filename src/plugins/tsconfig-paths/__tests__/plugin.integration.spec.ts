/**
 * @file Integration Tests - tsconfig-paths plugin
 * @module mkbuild/plugins/tsconfig-paths/tests/integration
 */

import ESBUILD_OPTIONS from '#fixtures/esbuild-options'
import type { Spy } from '#tests/interfaces'
import {
  build,
  type BuildFailure,
  type BuildOptions,
  type Plugin
} from 'esbuild'
import Module from 'node:module'
import path from 'node:path'
import { createMatchPath } from 'tsconfig-paths'
import {
  tsConfigLoader,
  type TsConfigLoaderResult
} from 'tsconfig-paths/lib/tsconfig-loader'
import testSubject from '../plugin'

vi.mock('tsconfig-paths')
vi.mock('tsconfig-paths/lib/tsconfig-loader')

describe('integration:plugins/tsconfig-paths', () => {
  let options: BuildOptions
  let subject: Plugin

  beforeEach(() => {
    subject = testSubject()
    options = { ...ESBUILD_OPTIONS, plugins: [subject] }
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
        expect(tsConfigLoader).toHaveBeenCalledTimes(0)
        expect(createMatchPath).toHaveBeenCalledTimes(0)
        expect(failure!).to.have.keys(['errors', 'warnings'])
        expect(failure!.errors).toMatchSnapshot()
      })

      it('should send error message if tsconfig is not found', async () => {
        // Arrange
        const loader = tsConfigLoader as unknown as Spy<typeof tsConfigLoader>
        let failure: BuildFailure

        // Act
        loader.mockReturnValueOnce({
          baseUrl: '',
          paths: {},
          tsConfigPath: ''
        })
        try {
          await build(options)
        } catch (e: unknown) {
          failure = e as BuildFailure
        }

        // Expect
        expect(tsConfigLoader).toHaveBeenCalledTimes(1)
        expect(createMatchPath).toHaveBeenCalledTimes(0)
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
          external: Module.builtinModules.flatMap(m => [m, 'node:' + m])
        })

        // Expect
        expect(tsConfigLoader).toHaveBeenCalledTimes(0)
        expect(createMatchPath).toHaveBeenCalledTimes(0)
      })

      it('should skip files that are not javascript', async () => {
        // Arrange
        const tsc = tsConfigLoader as unknown as Spy<typeof tsConfigLoader>
        const tsconfig_result: TsConfigLoaderResult = {
          baseUrl: undefined,
          paths: undefined,
          tsConfigPath: path.resolve('tsconfig.json')
        }

        // Act
        tsc.mockReturnValueOnce(tsconfig_result)
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

    describe('path aliases', () => {
      it('should resolve aliases in copied files', async () => {
        // Act
        const { outputFiles } = await build({
          ...options,
          entryPoints: ['__fixtures__/values.d.ts'],
          format: 'esm',
          loader: { '.d.ts': 'copy' }
        })

        // Expect
        expect(outputFiles).to.be.an('array').of.length(1)
        expect(outputFiles![0]!.text).toMatchSnapshot()
      })

      it('should resolve aliases in transpiled cjs files', async () => {
        // Act
        const { outputFiles } = await build({
          ...options,
          entryPoints: ['__fixtures__/tsconfig-paths.cts'],
          format: 'cjs',
          loader: { '.cts': 'ts' },
          outExtension: { '.js': '.cjs' }
        })

        // Expect
        expect(outputFiles).to.be.an('array').of.length(1)
        expect(outputFiles![0]!.text).toMatchSnapshot()
      })

      it('should resolve aliases in transpiled esm files', async () => {
        // Act
        const { outputFiles } = await build({
          ...options,
          entryPoints: ['__fixtures__/tsconfig-paths.mts'],
          format: 'esm',
          loader: { '.mts': 'ts' },
          outExtension: { '.js': '.mjs' }
        })

        // Expect
        expect(outputFiles).to.be.an('array').of.length(1)
        expect(outputFiles![0]!.text).toMatchSnapshot()
      })
    })
  })
})
