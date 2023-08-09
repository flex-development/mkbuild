/**
 * @file Type Tests - OutputExtension
 * @module mkbuild/types/tests/unit-d/OutputExtension
 */

import type TestSubject from '../output-extension'

describe('unit-d:types/OutputExtension', () => {
  it('should extract ".cjs"', () => {
    expectTypeOf<TestSubject>().extract<'.cjs'>().not.toBeNever()
  })

  it('should extract ".js"', () => {
    expectTypeOf<TestSubject>().extract<'.js'>().not.toBeNever()
  })

  it('should extract ".mjs"', () => {
    expectTypeOf<TestSubject>().extract<'.mjs'>().not.toBeNever()
  })

  it('should extract "cjs"', () => {
    expectTypeOf<TestSubject>().extract<'cjs'>().not.toBeNever()
  })

  it('should extract "js"', () => {
    expectTypeOf<TestSubject>().extract<'js'>().not.toBeNever()
  })

  it('should extract "mjs"', () => {
    expectTypeOf<TestSubject>().extract<'mjs'>().not.toBeNever()
  })

  describe('min', () => {
    it('should extract ".min.cjs"', () => {
      expectTypeOf<TestSubject>().extract<'.min.cjs'>().not.toBeNever()
    })

    it('should extract ".min.js"', () => {
      expectTypeOf<TestSubject>().extract<'.min.js'>().not.toBeNever()
    })

    it('should extract ".min.mjs"', () => {
      expectTypeOf<TestSubject>().extract<'.min.mjs'>().not.toBeNever()
    })

    it('should extract "min.cjs"', () => {
      expectTypeOf<TestSubject>().extract<'min.cjs'>().not.toBeNever()
    })

    it('should extract "min.js"', () => {
      expectTypeOf<TestSubject>().extract<'min.js'>().not.toBeNever()
    })

    it('should extract "min.mjs"', () => {
      expectTypeOf<TestSubject>().extract<'min.mjs'>().not.toBeNever()
    })
  })
})
