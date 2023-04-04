/**
 * @file Type Tests - OutputExtension
 * @module mkbuild/types/tests/unit-d/OutputExtension
 */

import type TestSubject from '../output-extension'

describe('unit-d:types/OutputExtension', () => {
  it('should extract ".cjs"', () => {
    expectTypeOf<TestSubject>().extract<'.cjs'>().toBeString()
  })

  it('should extract ".js"', () => {
    expectTypeOf<TestSubject>().extract<'.js'>().toBeString()
  })

  it('should extract ".mjs"', () => {
    expectTypeOf<TestSubject>().extract<'.mjs'>().toBeString()
  })

  it('should extract "cjs"', () => {
    expectTypeOf<TestSubject>().extract<'cjs'>().toBeString()
  })

  it('should extract "js"', () => {
    expectTypeOf<TestSubject>().extract<'js'>().toBeString()
  })

  it('should extract "mjs"', () => {
    expectTypeOf<TestSubject>().extract<'mjs'>().toBeString()
  })

  describe('min', () => {
    it('should extract ".min.cjs"', () => {
      expectTypeOf<TestSubject>().extract<'.min.cjs'>().toBeString()
    })

    it('should extract ".min.js"', () => {
      expectTypeOf<TestSubject>().extract<'.min.js'>().toBeString()
    })

    it('should extract ".min.mjs"', () => {
      expectTypeOf<TestSubject>().extract<'.min.mjs'>().toBeString()
    })

    it('should extract "min.cjs"', () => {
      expectTypeOf<TestSubject>().extract<'min.cjs'>().toBeString()
    })

    it('should extract "min.js"', () => {
      expectTypeOf<TestSubject>().extract<'min.js'>().toBeString()
    })

    it('should extract "min.mjs"', () => {
      expectTypeOf<TestSubject>().extract<'min.mjs'>().toBeString()
    })
  })
})
