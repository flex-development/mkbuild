/**
 * @file Functional Tests - esbuilder
 * @module mkbuild/utils/tests/functional/esbuilder
 */

import type { Entry, Result, SourceFile } from '#src/interfaces'
import type { Format } from 'esbuild'
import { pick } from 'radash'
import testSubject from '../esbuilder'

describe('functional:utils/esbuilder', () => {
  const ENTRIES: Record<Format, Entry> = {
    cjs: {
      declaration: true,
      ext: '.cjs',
      format: 'cjs',
      outdir: 'dist/cjs',
      source: '__fixtures__'
    },
    esm: {
      declaration: true,
      ext: '.mjs',
      format: 'esm',
      outdir: 'dist/esm',
      source: '__fixtures__'
    },
    iife: {
      declaration: false,
      ext: '.js',
      format: 'iife',
      outdir: 'dist/iife',
      source: '__fixtures__'
    }
  }

  describe('file-to-file', () => {
    const keys: (keyof Result)[] = ['errors', 'outfile', 'text', 'warnings']

    describe('transfer', () => {
      it('should transfer .cjs file if entry.format is cjs', async () => {
        // Arrange
        const source: Pick<SourceFile, 'ext' | 'file'> = {
          ext: '.cjs',
          file: 'sum-of-intervals.cjs'
        }

        // Act
        const results = await testSubject(source, ENTRIES.cjs)

        // Expect
        expect(results.map(result => pick(result, keys))).toMatchSnapshot()
      })

      it('should transfer .d.cts file', async () => {
        // Arrange
        const source: Pick<SourceFile, 'ext' | 'file'> = {
          ext: '.d.cts',
          file: 'save-mark.d.cts'
        }

        // Act
        const results = await testSubject(source, ENTRIES.cjs)

        // Expect
        expect(results.map(result => pick(result, keys))).toMatchSnapshot()
      })

      it('should transfer .d.mts file', async () => {
        // Arrange
        const source: Pick<SourceFile, 'ext' | 'file'> = {
          ext: '.d.mts',
          file: 'my-atoi.d.mts'
        }

        // Act
        const results = await testSubject(source, ENTRIES.esm)

        // Expect
        expect(results.map(result => pick(result, keys))).toMatchSnapshot()
      })

      it('should transfer .d.ts file', async () => {
        // Arrange
        const source: Pick<SourceFile, 'ext' | 'file'> = {
          ext: '.d.ts',
          file: 'values.d.ts'
        }

        // Act
        const results = await testSubject(source, {
          ...ENTRIES.esm,
          ext: '.js'
        })

        // Expect
        expect(results.map(result => pick(result, keys))).toMatchSnapshot()
      })

      it('should transfer .json file', async () => {
        // Arrange
        const source: Pick<SourceFile, 'ext' | 'file'> = {
          ext: '.json',
          file: 'browser-usage.json'
        }

        // Act
        const results = await testSubject(source, ENTRIES.cjs)

        // Expect
        expect(results.map(result => pick(result, keys))).toMatchSnapshot()
      })

      it('should transfer .json5 file', async () => {
        // Arrange
        const source: Pick<SourceFile, 'ext' | 'file'> = {
          ext: '.json5',
          file: 'bitcoin-price.json5'
        }

        // Act
        const results = await testSubject(source, ENTRIES.esm)

        // Expect
        expect(results.map(result => pick(result, keys))).toMatchSnapshot()
      })

      it('should transfer .jsonc file', async () => {
        // Arrange
        const source: Pick<SourceFile, 'ext' | 'file'> = {
          ext: '.jsonc',
          file: 'apple-stock.jsonc'
        }

        // Act
        const results = await testSubject(source, ENTRIES.cjs)

        // Expect
        expect(results.map(result => pick(result, keys))).toMatchSnapshot()
      })

      it('should transfer .mjs file if entry.format is esm', async () => {
        // Arrange
        const source: Pick<SourceFile, 'ext' | 'file'> = {
          ext: '.mjs',
          file: 'sum-of-intervals.mjs'
        }

        // Act
        const results = await testSubject(source, ENTRIES.esm)

        // Expect
        expect(results.map(result => pick(result, keys))).toMatchSnapshot()
      })
    })

    describe('transpilation', () => {
      it('should transpile .cjs file if entry.format is not cjs', async () => {
        // Arrange
        const source: Pick<SourceFile, 'ext' | 'file'> = {
          ext: '.cjs',
          file: 'sum-of-intervals.cjs'
        }

        // Act
        const results = await testSubject(source, ENTRIES.esm)

        // Expect
        expect(results.map(result => pick(result, keys))).toMatchSnapshot()
      })

      it('should transpile .cts file', async () => {
        // Arrange
        const source: Pick<SourceFile, 'ext' | 'file'> = {
          ext: '.cts',
          file: 'my-atoi.cts'
        }

        // Act
        const results = await testSubject(source, ENTRIES.cjs)

        // Expect
        expect(results.map(result => pick(result, keys))).toMatchSnapshot()
      })

      it('should transpile .js file', async () => {
        // Arrange
        const source: Pick<SourceFile, 'ext' | 'file'> = {
          ext: '.js',
          file: 'hello-world.js'
        }

        // Act
        const results = await testSubject(source, ENTRIES.iife)

        // Expect
        expect(results.map(result => pick(result, keys))).toMatchSnapshot()
      })

      it('should transpile .jsx file', async () => {
        // Arrange
        const source: Pick<SourceFile, 'ext' | 'file'> = {
          ext: '.jsx',
          file: 'Counter.jsx'
        }

        // Act
        const results = await testSubject(source, ENTRIES.esm)

        // Expect
        expect(results.map(result => pick(result, keys))).toMatchSnapshot()
      })

      it('should transpile .mjs file if entry.format is not esm', async () => {
        // Arrange
        const source: Pick<SourceFile, 'ext' | 'file'> = {
          ext: '.mjs',
          file: 'sum-of-intervals.mjs'
        }

        // Act
        const results = await testSubject(source, ENTRIES.cjs)

        // Expect
        expect(results.map(result => pick(result, keys))).toMatchSnapshot()
      })

      it('should transpile .mts file', async () => {
        // Arrange
        const source: Pick<SourceFile, 'ext' | 'file'> = {
          ext: '.mts',
          file: 'reverse.mts'
        }

        // Act
        const results = await testSubject(source, ENTRIES.esm)

        // Expect
        expect(results.map(result => pick(result, keys))).toMatchSnapshot()
      })

      it('should transpile .ts file', async () => {
        // Arrange
        const source: Pick<SourceFile, 'ext' | 'file'> = {
          ext: '.ts',
          file: 'dbl-linear.ts'
        }

        // Act
        const results = await testSubject(source, ENTRIES.esm)

        // Expect
        expect(results.map(result => pick(result, keys))).toMatchSnapshot()
      })

      it('should transpile .tsx file', async () => {
        // Arrange
        const source: Pick<SourceFile, 'ext' | 'file'> = {
          ext: '.tsx',
          file: 'Button.tsx'
        }

        // Act
        const results = await testSubject(source, ENTRIES.esm)

        // Expect
        expect(results.map(result => pick(result, keys))).toMatchSnapshot()
      })
    })
  })
})
