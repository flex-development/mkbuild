/**
 * @file Integration Tests - esbuilder
 * @module mkbuild/internal/tests/integration/esbuilder
 */

import type { Entry } from '#src/interfaces'
import loaders from '#src/utils/loaders'
import type { Mock } from '#tests/interfaces'
import * as mlly from '@flex-development/mlly'
import * as pathe from '@flex-development/pathe'
import * as esbuild from 'esbuild'
import testSubject from '../esbuilder'

vi.mock('#src/plugins/write/plugin')
vi.mock('esbuild')

describe('integration:internal/esbuilder', () => {
  describe('esbuild', () => {
    let build: Mock<(typeof esbuild)['build']>
    let external: string[]
    let resolveExtensions: pathe.Ext[]
    let outdir: string
    let write: boolean

    beforeEach(() => {
      build = esbuild.build as unknown as typeof build
      external = []
      resolveExtensions = [...mlly.RESOLVE_EXTENSIONS]
      outdir = 'dist'
      write = false
    })

    describe('cjs', () => {
      let absWorkingDir: string
      let entry: Partial<Entry>
      let format: esbuild.Format

      beforeAll(() => {
        entry = { cwd: '__fixtures__/pkg/find-uniq' }
        absWorkingDir = pathe.resolve(entry.cwd!) + pathe.sep
        format = entry.format = 'cjs'
      })

      it('should create bundle in cjs format', async () => {
        // Arrange
        const bundle: boolean = true
        const source: string = 'find-uniq.cts'

        // Act
        const [, results] = await testSubject({ ...entry, bundle, source })

        // Expect
        expect(results).toMatchSnapshot()
        expect(build.mock.lastCall?.[0]).toMatchObject({
          absWorkingDir,
          bundle,
          conditions: [],
          entryNames: '[dir]/[name]',
          entryPoints: [source],
          external,
          format,
          loader: loaders(format, bundle),
          metafile: true,
          outExtension: { '.js': '.cjs' },
          outbase: '.',
          outdir,
          platform: '',
          plugins: [{ name: 'fully-specified', setup: expect.any(Function) }],
          resolveExtensions,
          tsconfig: '',
          write
        })
      })

      it('should do transpilation in cjs format', async () => {
        // Arrange
        const pattern: string = 'find-uniq.cts'
        const source: string = '.'

        // Act
        const [, results] = await testSubject({ ...entry, pattern, source })

        // Expect
        expect(results).toMatchSnapshot()
        expect(build.mock.lastCall?.[0]).toMatchObject({
          absWorkingDir,
          bundle: false,
          conditions: [...mlly.CONDITIONS],
          entryNames: '[dir]/[name]',
          entryPoints: [pattern],
          external,
          format,
          loader: loaders(format),
          metafile: true,
          outExtension: { '.js': '.cjs' },
          outbase: source,
          outdir,
          platform: '',
          plugins: [{ name: 'fully-specified', setup: expect.any(Function) }],
          resolveExtensions,
          tsconfig: '',
          write
        })
      })
    })

    describe('esm', () => {
      let absWorkingDir: string
      let entry: Partial<Entry>
      let format: esbuild.Format

      beforeAll(() => {
        entry = { cwd: '__fixtures__/pkg/reverse', tsconfig: 'tsconfig.json' }
        absWorkingDir = pathe.resolve(entry.cwd!) + pathe.sep
        format = 'esm'
      })

      it('should create bundle in esm format', async () => {
        // Arrange
        const bundle: boolean = true
        const keepNames: boolean = true
        const name: string = 'index'
        const platform: esbuild.Platform = 'node'
        const sourcemap: boolean = true
        const sourcesContent: boolean = false

        // Act
        const [, results] = await testSubject({
          ...entry,
          bundle,
          keepNames,
          name,
          platform,
          sourcemap,
          sourcesContent
        })

        // Expect
        expect(results).toMatchSnapshot()
        expect(build.mock.lastCall?.[0]).toMatchObject({
          absWorkingDir,
          bundle,
          conditions: [],
          entryNames: `[dir]/${name}`,
          entryPoints: ['src/index.mts'],
          external,
          format,
          keepNames,
          loader: loaders(format, bundle),
          metafile: true,
          outExtension: { '.js': '.mjs' },
          outbase: 'src',
          outdir,
          platform,
          plugins: [
            { name: 'decorators', setup: expect.any(Function) },
            { name: 'create-require', setup: expect.any(Function) },
            { name: 'fully-specified', setup: expect.any(Function) }
          ],
          resolveExtensions,
          sourcemap,
          sourcesContent,
          tsconfig: entry.tsconfig,
          write
        })
      })

      it('should do transpilation in esm format', async () => {
        // Act
        const [, results] = await testSubject({
          ...entry,
          dts: true,
          write: true
        })

        // Expect
        expect(results).toMatchSnapshot()
        expect(build.mock.lastCall?.[0]).toMatchObject({
          absWorkingDir,
          bundle: false,
          conditions: [...mlly.CONDITIONS],
          entryNames: '[dir]/[name]',
          entryPoints: [
            'src/index.mts',
            'src/max-value.ts',
            'src/min-value.ts',
            'src/reverse.mts'
          ],
          external,
          format,
          loader: loaders(format),
          metafile: true,
          outExtension: { '.js': '.mjs' },
          outbase: 'src',
          outdir,
          platform: '',
          plugins: [
            { name: 'decorators', setup: expect.any(Function) },
            { name: 'dts', setup: expect.any(Function) },
            { name: 'tsconfig-paths', setup: expect.any(Function) },
            { name: 'fully-specified', setup: expect.any(Function) },
            { name: 'write', setup: expect.any(Function) }
          ],
          resolveExtensions,
          tsconfig: entry.tsconfig,
          write
        })
      })
    })

    describe('iife', () => {
      let absWorkingDir: string
      let entry: Partial<Entry>
      let format: esbuild.Format

      beforeAll(() => {
        entry = { cwd: '__fixtures__/pkg/buddy' }
        absWorkingDir = pathe.resolve(entry.cwd!) + pathe.sep
        format = entry.format = 'iife'
      })

      it('should create bundle in iife format', async () => {
        // Arrange
        const bundle: boolean = true
        const source: string = 'buddy.js'

        // Act
        const [, results] = await testSubject({ ...entry, bundle, source })

        // Expect
        expect(results).toMatchSnapshot()
        expect(build.mock.lastCall?.[0]).toMatchObject({
          absWorkingDir,
          bundle,
          conditions: [],
          entryNames: '[dir]/[name]',
          entryPoints: [source],
          external,
          format,
          loader: loaders(format, bundle),
          metafile: true,
          outExtension: { '.js': '.js' },
          outbase: '.',
          outdir,
          platform: '',
          plugins: [],
          resolveExtensions,
          tsconfig: '',
          write
        })
      })

      it('should do transpilation in iife format', async () => {
        // Arrange
        const pattern: string = 'buddy.js'
        const source: string = '.'

        // Act
        const [, results] = await testSubject({ ...entry, pattern, source })

        // Expect
        expect(results).toMatchSnapshot()
        expect(build.mock.lastCall?.[0]).toMatchObject({
          absWorkingDir,
          bundle: false,
          conditions: [...mlly.CONDITIONS],
          entryNames: '[dir]/[name]',
          entryPoints: [pattern],
          external,
          format,
          loader: loaders(format),
          metafile: true,
          outExtension: { '.js': '.js' },
          outbase: source,
          outdir,
          platform: '',
          plugins: [],
          resolveExtensions,
          tsconfig: '',
          write
        })
      })
    })
  })
})
