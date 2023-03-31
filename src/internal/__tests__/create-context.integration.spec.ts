/**
 * @file Integration Tests - createContext
 * @module mkbuild/internal/tests/integration/createContext
 */

import type { Task } from '#src/interfaces'
import loaders from '#src/utils/loaders'
import getPackageJson from '#tests/utils/get-package-json'
import * as mlly from '@flex-development/mlly'
import * as pathe from '@flex-development/pathe'
import type { PackageJson } from '@flex-development/pkg-types'
import * as esbuild from 'esbuild'
import testSubject from '../create-context'

vi.mock('#src/utils/fs')
vi.mock('esbuild')

describe('integration:internal/createContext', () => {
  describe('esbuild', () => {
    let allowOverwrite: boolean
    let conditions: string[]
    let external: string[]
    let resolveExtensions: pathe.Ext[]
    let outdir: string
    let write: boolean

    beforeEach(() => {
      allowOverwrite = false
      conditions = [...mlly.CONDITIONS]
      external = []
      resolveExtensions = [...mlly.RESOLVE_EXTENSIONS]
      outdir = 'dist'
      write = false
    })

    describe('cjs', () => {
      let absWorkingDir: string
      let format: esbuild.Format
      let pkg: PackageJson
      let task: Partial<Task>

      beforeAll(async () => {
        task = { clean: false, cwd: '__fixtures__/pkg/buddy' }
        absWorkingDir = pathe.resolve(task.cwd!)
        format = task.format = 'cjs'
        pkg = await getPackageJson(pathe.join(absWorkingDir, 'package.json'))
      })

      it('should create context for cjs bundle', async () => {
        // Arrange
        const bundle: boolean = true
        const source: string = 'buddy.js'

        // Act
        await testSubject({ ...task, bundle, source }, pkg)

        // Expect
        expect(vi.mocked(esbuild.context).mock.lastCall?.[0]).toMatchObject({
          absWorkingDir,
          allowOverwrite,
          bundle,
          conditions,
          entryNames: '[dir]/[name]',
          entryPoints: [source],
          external,
          format,
          loader: loaders(format, bundle),
          metafile: true,
          outExtension: { '.js': '.cjs' },
          outbase: '.',
          outdir,
          plugins: [
            { name: 'pkgtype', setup: expect.any(Function) },
            { name: 'fully-specified', setup: expect.any(Function) },
            { name: 'filter', setup: expect.any(Function) }
          ],
          resolveExtensions,
          write
        })
      })

      it('should create context for cjs transpilation', async () => {
        // Arrange
        const pattern: string = 'buddy.js'
        const source: string = '.'

        // Act
        await testSubject({ ...task, pattern, source }, pkg)

        // Expect
        expect(vi.mocked(esbuild.context).mock.lastCall?.[0]).toMatchObject({
          absWorkingDir,
          allowOverwrite,
          bundle: false,
          conditions,
          entryNames: '[dir]/[name]',
          entryPoints: [pattern],
          external,
          format,
          loader: loaders(format),
          metafile: true,
          outExtension: { '.js': '.cjs' },
          outbase: source,
          outdir,
          plugins: [
            { name: 'pkgtype', setup: expect.any(Function) },
            { name: 'fully-specified', setup: expect.any(Function) },
            { name: 'filter', setup: expect.any(Function) }
          ],
          resolveExtensions,
          write
        })
      })
    })

    describe('esm', () => {
      let absWorkingDir: string
      let format: esbuild.Format
      let task: Partial<Task>

      beforeAll(() => {
        task = { cwd: '__fixtures__/pkg/reverse', tsconfig: 'tsconfig.json' }
        format = 'esm'
        absWorkingDir = pathe.resolve(task.cwd!)
      })

      it('should create context for esm bundle', async () => {
        // Arrange
        const bundle: boolean = true
        const keepNames: boolean = true
        const name: string = 'index'
        const platform: esbuild.Platform = 'node'
        const sourcemap: boolean = true
        const sourcesContent: boolean = false

        // Act
        await testSubject({
          ...task,
          bundle,
          keepNames,
          name,
          platform,
          sourcemap,
          sourcesContent
        })

        // Expect
        expect(vi.mocked(esbuild.context).mock.lastCall?.[0]).toMatchObject({
          absWorkingDir,
          allowOverwrite,
          bundle,
          conditions,
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
            { name: 'pkgtype', setup: expect.any(Function) },
            { name: 'clean', setup: expect.any(Function) },
            { name: 'create-require', setup: expect.any(Function) },
            { name: 'decorators', setup: expect.any(Function) },
            { name: 'tsconfig-paths', setup: expect.any(Function) },
            { name: 'fully-specified', setup: expect.any(Function) },
            { name: 'filter', setup: expect.any(Function) }
          ],
          resolveExtensions,
          sourcemap,
          sourcesContent,
          tsconfig: task.tsconfig,
          write
        })
      })

      it('should create context for esm transpilation', async () => {
        // Act
        await testSubject({ ...task, dts: 'only', write: true })

        // Expect
        expect(vi.mocked(esbuild.context).mock.lastCall?.[0]).toMatchObject({
          absWorkingDir,
          allowOverwrite,
          bundle: false,
          conditions,
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
          plugins: [
            { name: 'pkgtype', setup: expect.any(Function) },
            { name: 'clean', setup: expect.any(Function) },
            { name: 'dts', setup: expect.any(Function) },
            { name: 'decorators', setup: expect.any(Function) },
            { name: 'tsconfig-paths', setup: expect.any(Function) },
            { name: 'fully-specified', setup: expect.any(Function) },
            { name: 'filter', setup: expect.any(Function) },
            { name: 'write', setup: expect.any(Function) }
          ],
          resolveExtensions,
          tsconfig: task.tsconfig,
          write
        })
      })
    })

    describe('iife', () => {
      let absWorkingDir: string
      let format: esbuild.Format
      let task: Partial<Task>

      beforeAll(() => {
        task = { cwd: '__fixtures__/pkg/find-uniq' }
        format = task.format = 'iife'
        absWorkingDir = pathe.resolve(task.cwd!)
      })

      it('should create context for iife bundle', async () => {
        // Arrange
        const bundle: boolean = true
        const source: string = 'find-uniq.cts'

        // Act
        await testSubject({ ...task, bundle, source })

        // Expect
        expect(vi.mocked(esbuild.context).mock.lastCall?.[0]).toMatchObject({
          absWorkingDir,
          allowOverwrite,
          bundle,
          conditions,
          entryNames: '[dir]/[name]',
          entryPoints: [source],
          external,
          format,
          loader: loaders(format, bundle),
          metafile: true,
          outExtension: { '.js': '.js' },
          outbase: '.',
          outdir,
          plugins: [
            { name: 'pkgtype', setup: expect.any(Function) },
            { name: 'clean', setup: expect.any(Function) },
            { name: 'filter', setup: expect.any(Function) }
          ],
          resolveExtensions,
          write
        })
      })

      it('should create context for iife transpilation', async () => {
        // Arrange
        const pattern: string = 'find-uniq.cts'
        const source: string = '.'

        // Act
        await testSubject({ ...task, pattern, source })

        // Expect
        expect(vi.mocked(esbuild.context).mock.lastCall?.[0]).toMatchObject({
          absWorkingDir,
          allowOverwrite,
          bundle: false,
          conditions,
          entryNames: '[dir]/[name]',
          entryPoints: [pattern],
          external,
          format,
          loader: loaders(format),
          metafile: true,
          outExtension: { '.js': '.js' },
          outbase: source,
          outdir,
          plugins: [
            { name: 'pkgtype', setup: expect.any(Function) },
            { name: 'clean', setup: expect.any(Function) },
            { name: 'filter', setup: expect.any(Function) }
          ],
          resolveExtensions,
          write
        })
      })
    })
  })
})
