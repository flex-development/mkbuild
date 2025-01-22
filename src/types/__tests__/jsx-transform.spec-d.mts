/**
 * @file Type Tests - JsxTransform
 * @module mkbuild/types/tests/unit-d/JsxTransform
 */

import type TestSubject from '#types/jsx-transform'

describe('unit-d:types/JsxTransform', () => {
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
