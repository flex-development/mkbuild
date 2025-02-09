/**
 * @file Type Tests - GetInterop
 * @module mkbuild/types/tests/unit-d/GetInterop
 */

import type TestSubject from '#types/get-interop'
import type { InteropType } from 'rollup'

describe('unit-d:types/GetInterop', () => {
  it('should match [this: void]', () => {
    expectTypeOf<TestSubject>().thisParameter.toEqualTypeOf<void>()
  })

  describe('parameters', () => {
    it('should be callable with [string | null]', () => {
      expectTypeOf<TestSubject>()
        .parameters
        .toEqualTypeOf<[string | null]>()
    })
  })

  describe('returns', () => {
    it('should return InteropType', () => {
      expectTypeOf<TestSubject>().returns.toEqualTypeOf<InteropType>()
    })
  })
})
