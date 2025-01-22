/**
 * @file Type Tests - DTSOption
 * @module mkbuild/types/tests/unit-d/DTSOption
 */

import type TestSubject from '#types/dts-option'

describe('unit-d:types/DTSOption', () => {
  it('should extract "only"', () => {
    expectTypeOf<TestSubject>().extract<'only'>().not.toBeNever()
  })

  it('should extract boolean', () => {
    expectTypeOf<TestSubject>().extract<boolean>().not.toBeNever()
  })
})
