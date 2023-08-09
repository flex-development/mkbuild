/**
 * @file Type Tests - Jsx
 * @module mkbuild/types/tests/unit-d/Jsx
 */

import type TestSubject from '../jsx'

describe('unit-d:types/Jsx', () => {
  it('should extract "automatic"', () => {
    expectTypeOf<TestSubject>().extract<'automatic'>().not.toBeNever()
  })

  it('should extract "preserve"', () => {
    expectTypeOf<TestSubject>().extract<'preserve'>().not.toBeNever()
  })

  it('should extract "transform"', () => {
    expectTypeOf<TestSubject>().extract<'transform'>().not.toBeNever()
  })
})
