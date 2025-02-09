/**
 * @file Type Tests - IsExternal
 * @module mkbuild/types/tests/unit-d/IsExternal
 */

import type TestSubject from '#types/is-external'

describe('unit-d:types/IsExternal', () => {
  it('should match [this: void]', () => {
    expectTypeOf<TestSubject>().thisParameter.toEqualTypeOf<void>()
  })

  describe('parameters', () => {
    it('should be callable with [string, string | undefined, boolean]', () => {
      expectTypeOf<TestSubject>()
        .parameters
        .toEqualTypeOf<[string, string | undefined, boolean]>()
    })
  })

  describe('returns', () => {
    it('should return boolean | null | void | undefined', () => {
      expectTypeOf<TestSubject>()
        .returns
        .toEqualTypeOf<boolean | null | void | undefined>()
    })
  })
})
