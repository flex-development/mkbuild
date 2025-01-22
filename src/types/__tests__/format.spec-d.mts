/**
 * @file Type Tests - Format
 * @module mkbuild/types/tests/unit-d/Format
 */

import type TestSubject from '#types/format'

describe('unit-d:types/Format', () => {
  it('should extract "cjs"', () => {
    expectTypeOf<TestSubject>().extract<'cjs'>().not.toBeNever()
  })

  it('should extract "esm"', () => {
    expectTypeOf<TestSubject>().extract<'esm'>().not.toBeNever()
  })

  it('should extract "iife"', () => {
    expectTypeOf<TestSubject>().extract<'iife'>().not.toBeNever()
  })
})
