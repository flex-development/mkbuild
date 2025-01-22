/**
 * @file Type Tests - SourcemapOption
 * @module mkbuild/types/tests/unit-d/SourcemapOption
 */

import type TestSubject from '#types/sourcemap-option'

describe('unit-d:types/SourcemapOption', () => {
  it('should extract "hidden"', () => {
    expectTypeOf<TestSubject>().extract<'hidden'>().not.toBeNever()
  })

  it('should extract "inline"', () => {
    expectTypeOf<TestSubject>().extract<'inline'>().not.toBeNever()
  })

  it('should extract boolean', () => {
    expectTypeOf<TestSubject>().extract<boolean>().not.toBeNever()
  })
})
