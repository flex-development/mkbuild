/**
 * @file Unit Tests - loaders
 * @module mkbuild/utils/tests/unit/loaders
 */

import type * as esbuild from 'esbuild'
import testSubject from '../loaders'

describe('unit:utils/loaders', () => {
  describe('cjs', () => {
    let format: esbuild.Format

    beforeAll(() => {
      format = 'cjs'
    })

    it('should return loader configuration for cjs bundle', () => {
      expect(testSubject(format, true)).toMatchSnapshot()
    })

    it('should return loader configuration for cjs transpilation', () => {
      expect(testSubject(format, false)).toMatchSnapshot()
    })
  })

  describe('esm', () => {
    let format: esbuild.Format

    beforeAll(() => {
      format = 'esm'
    })

    it('should return loader configuration for esm bundle', () => {
      expect(testSubject(format, true)).toMatchSnapshot()
    })

    it('should return loader configuration for esm transpilation', () => {
      expect(testSubject(format, false)).toMatchSnapshot()
    })
  })
})
