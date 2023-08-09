/**
 * @file Type Tests - Sourcemap
 * @module mkbuild/types/tests/unit-d/Sourcemap
 */

import type TestSubject from '../sourcemap'

describe('unit-d:types/Sourcemap', () => {
  it('should extract "both"', () => {
    expectTypeOf<TestSubject>().extract<'both'>().not.toBeNever()
  })

  it('should extract "external"', () => {
    expectTypeOf<TestSubject>().extract<'external'>().not.toBeNever()
  })

  it('should extract "inline"', () => {
    expectTypeOf<TestSubject>().extract<'inline'>().not.toBeNever()
  })

  it('should extract "linked"', () => {
    expectTypeOf<TestSubject>().extract<'linked'>().not.toBeNever()
  })
})
