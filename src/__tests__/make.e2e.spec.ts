/**
 * @file E2E Tests - make
 * @module mkbuild/tests/make/e2e
 */

import type { Config, Entry } from '#src/interfaces'
import * as internal from '#src/internal'
import { IGNORE_PATTERNS } from '#src/utils'
import type { Mock } from '#tests/interfaces'
import pathe from '@flex-development/pathe'
import type { Platform } from 'esbuild'
import testSubject from '../make'

vi.mock('#src/internal/esbuilder')

describe('e2e:make', () => {
  let configfile: boolean
  let esbuilder: Mock<(typeof internal)['esbuilder']>
  let external: string[]
  let ignore: string[]
  let outdir: string
  let write: boolean

  beforeAll(() => {
    configfile = false
    esbuilder = internal.esbuilder as typeof esbuilder
    external = []
    ignore = [...IGNORE_PATTERNS]
    outdir = 'dist'
    write = false
  })

  it('should copy files to output directory', async () => {
    // Act
    const results = await testSubject({
      configfile,
      cwd: '__fixtures__/pkg/sum-of-intervals',
      loader: { '.cjs': 'copy', '.mjs': 'copy' },
      source: '.'
    })

    // Expect
    expect(results).toMatchSnapshot()
  })

  describe('cjs', () => {
    let config: Config
    let entry: Partial<Entry>

    beforeAll(() => {
      config = {
        configfile,
        cwd: '__fixtures__/pkg/my-atoi',
        format: 'cjs',
        tsconfig: 'tsconfig.json'
      }

      entry = {
        createRequire: false,
        cwd: pathe.resolve(config.cwd!),
        dts: false,
        ext: '.cjs',
        external,
        format: config.format!,
        ignore,
        outdir,
        pattern: '**',
        tsconfig: config.tsconfig!,
        write
      }
    })

    it('should create bundle in cjs format', async () => {
      // Arrange
      const bundle: boolean = true
      const name: string = 'index'

      // Act
      const results = await testSubject({ ...config, bundle, name })

      // Expect
      expect(results).toMatchSnapshot()
      expect(esbuilder.mock.lastCall?.[0]).toMatchObject({
        ...entry,
        bundle,
        name,
        source: 'src/index'
      })
    })

    it('should create bundleless build in cjs format', async () => {
      // Act
      const results = await testSubject(config)

      // Expect
      expect(results).toMatchSnapshot()
      expect(esbuilder.mock.lastCall?.[0]).toMatchObject({
        ...entry,
        bundle: false,
        source: 'src'
      })
    })
  })

  describe('esm', () => {
    let config: Config
    let entry: Partial<Entry>

    beforeAll(() => {
      config = { configfile, cwd: '__fixtures__/pkg/dbl-linear' }

      entry = {
        cwd: pathe.resolve(config.cwd!),
        dts: false,
        ext: '.mjs',
        external,
        format: 'esm',
        ignore,
        outdir,
        write
      }
    })

    it('should create bundle in esm format', async () => {
      // Arrange
      const bundle: boolean = true
      const name: string = 'index'
      const platform: Platform = 'node'
      const source: string = 'dbl-linear.ts'

      // Act
      const results = await testSubject({
        ...config,
        bundle,
        name,
        platform,
        source
      })

      // Expect
      expect(results).toMatchSnapshot()
      expect(esbuilder.mock.lastCall?.[0]).toMatchObject({
        ...entry,
        bundle,
        createRequire: true,
        name,
        pattern: '**',
        platform,
        source
      })
    })

    it('should create bundleless build in esm format', async () => {
      // Arrange
      const pattern: string = 'dbl-linear.ts'
      const source: string = '.'

      // Act
      const results = await testSubject({ ...config, pattern, source })

      // Expect
      expect(results).toMatchSnapshot()
      expect(esbuilder.mock.lastCall?.[0]).toMatchObject({
        ...entry,
        bundle: false,
        createRequire: false,
        pattern,
        source
      })
    })
  })

  describe('iife', () => {
    let config: Config
    let entry: Partial<Entry>

    beforeAll(() => {
      config = {
        configfile,
        cwd: '__fixtures__/pkg/tribonacci',
        format: 'iife'
      }

      entry = {
        createRequire: false,
        cwd: pathe.resolve(config.cwd!),
        dts: false,
        ext: '.js',
        external,
        format: 'iife',
        ignore,
        outdir,
        pattern: '**',
        write
      }
    })

    it('should create bundle in iife format', async () => {
      // Arrange
      const bundle: boolean = true
      const name: string = 'index'
      const source: string = 'src/tribonacci'

      // Act
      const results = await testSubject({ ...config, bundle, name, source })

      // Expect
      expect(results).toMatchSnapshot()
      expect(esbuilder.mock.lastCall?.[0]).toMatchObject({
        ...entry,
        bundle,
        name,
        source
      })
    })

    it('should create bundleless build in iife format', async () => {
      // Act
      const results = await testSubject(config)

      // Expect
      expect(results).toMatchSnapshot()
      expect(esbuilder.mock.lastCall?.[0]).toMatchObject({
        ...entry,
        bundle: false,
        source: 'src'
      })
    })
  })
})
