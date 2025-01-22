/**
 * @file Type Tests - SourcemapIgnoreTest
 * @module mkbuild/types/tests/unit-d/SourcemapIgnoreTest
 */

import type TestSubject from '#types/sourcemap-ignore-test'

describe('unit-d:types/SourcemapIgnoreTest', () => {
  it('should match [this: void]', () => {
    expectTypeOf<TestSubject>().thisParameter.toEqualTypeOf<void>()
  })

  describe('parameters', () => {
    it('should be callable with [string, string]', () => {
      expectTypeOf<TestSubject>().parameters.toEqualTypeOf<[string, string]>()
    })
  })

  describe('returns', () => {
    it('should return boolean', () => {
      expectTypeOf<TestSubject>().returns.toEqualTypeOf<boolean>()
    })
  })
})
