/**
 * @file Type Tests - Jsx
 * @module mkbuild/types/tests/unit-d/Jsx
 */

import type TestSubject from '../jsx'

describe('unit-d:types/Jsx', () => {
  it('should extract "automatic"', () => {
    expectTypeOf<TestSubject>().extract<'automatic'>().toBeString()
  })

  it('should extract "preserve"', () => {
    expectTypeOf<TestSubject>().extract<'preserve'>().toBeString()
  })

  it('should extract "transform"', () => {
    expectTypeOf<TestSubject>().extract<'transform'>().toBeString()
  })
})
