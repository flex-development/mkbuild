/**
 * @file Type Tests - SourcemapPathTransform
 * @module mkbuild/types/tests/unit-d/SourcemapPathTransform
 */

import type TestSubject from '#types/sourcemap-path-transform'

describe('unit-d:types/SourcemapPathTransform', () => {
  it('should match [this: void]', () => {
    expectTypeOf<TestSubject>().thisParameter.toEqualTypeOf<void>()
  })

  describe('parameters', () => {
    it('should be callable with [string, string]', () => {
      expectTypeOf<TestSubject>().parameters.toEqualTypeOf<[string, string]>()
    })
  })

  describe('returns', () => {
    it('should return string', () => {
      expectTypeOf<TestSubject>().returns.toEqualTypeOf<string>()
    })
  })
})
