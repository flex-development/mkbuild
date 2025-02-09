/**
 * @file Type Tests - GetModuleContext
 * @module mkbuild/types/tests/unit-d/GetModuleContext
 */

import type TestSubject from '#types/get-module-context'

describe('unit-d:types/GetModuleContext', () => {
  it('should match [this: void]', () => {
    expectTypeOf<TestSubject>().thisParameter.toEqualTypeOf<void>()
  })

  describe('parameters', () => {
    it('should be callable with [string]', () => {
      expectTypeOf<TestSubject>().parameters.toEqualTypeOf<[string]>()
    })
  })

  describe('returns', () => {
    it('should return string | null | undefined', () => {
      expectTypeOf<TestSubject>()
        .returns
        .toEqualTypeOf<string | null | undefined>()
    })
  })
})
