/**
 * @file E2E Tests - make
 * @module mkbuild/tests/make/e2e
 */

import type { Config } from '#src/interfaces'
import type { Platform } from 'esbuild'
import testSubject from '../make'

vi.mock('../plugins/clean/plugin')

describe('e2e:make', () => {
  let configfile: false
  let dts: false

  beforeAll(() => {
    configfile = false
    dts = false
  })

  it('should copy files to output directory', async () => {
    // Act
    const results = await testSubject({
      configfile,
      cwd: '__fixtures__/pkg/sum-of-intervals',
      dts,
      loader: { '.cjs': 'copy', '.mjs': 'copy' },
      source: '.'
    })

    // Expect
    expect(results).toMatchSnapshot()
  })

  describe('cjs', () => {
    let config: Config

    beforeAll(() => {
      config = {
        configfile,
        cwd: '__fixtures__/pkg/my-atoi',
        dts,
        format: 'cjs',
        tsconfig: 'tsconfig.json'
      }
    })

    it('should create bundle in cjs format', async () => {
      // Arrange
      const bundle: boolean = true
      const name: string = 'index'

      // Act + Expect
      expect(await testSubject({ ...config, bundle, name })).toMatchSnapshot()
    })

    it('should create bundleless build in cjs format', async () => {
      expect(await testSubject(config)).toMatchSnapshot()
    })
  })

  describe('esm', () => {
    let config: Config

    beforeAll(() => {
      config = { configfile, cwd: '__fixtures__/pkg/dbl-linear', dts }
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
        dts,
        name,
        platform,
        source
      })

      // Expect
      expect(results).toMatchSnapshot()
    })

    it('should create bundleless build in esm format', async () => {
      // Arrange
      const pattern: string = 'dbl-linear.ts'
      const source: string = '.'

      // Act
      const results = await testSubject({ ...config, pattern, source })

      // Expect
      expect(results).toMatchSnapshot()
    })
  })

  describe('iife', () => {
    let config: Config

    beforeAll(() => {
      config = {
        configfile,
        cwd: '__fixtures__/pkg/tribonacci',
        dts,
        format: 'iife'
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
    })

    it('should create bundleless build in iife format', async () => {
      expect(await testSubject(config)).toMatchSnapshot()
    })
  })
})
