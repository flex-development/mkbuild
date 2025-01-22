/**
 * @file Type Tests - SanitizeFileNameFn
 * @module mkbuild/types/tests/unit-d/SanitizeFileNameFn
 */

import type TestSubject from '#types/sanitize-file-name-fn'

describe('unit-d:types/SanitizeFileNameFn', () => {
  it('should match [this: void]', () => {
    expectTypeOf<TestSubject>().thisParameter.toEqualTypeOf<void>()
  })

  describe('parameters', () => {
    it('should be callable with [string]', () => {
      expectTypeOf<TestSubject>().parameters.toEqualTypeOf<[string]>()
    })
  })

  describe('returns', () => {
    it('should return string', () => {
      expectTypeOf<TestSubject>().returns.toEqualTypeOf<string>()
    })
  })
})
