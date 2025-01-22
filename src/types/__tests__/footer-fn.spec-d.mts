/**
 * @file Type Tests - FooterFn
 * @module mkbuild/types/tests/unit-d/FooterFn
 */

import type TestSubject from '#types/footer-fn'
import type { PreRenderedChunk } from 'rollup'

describe('unit-d:types/FooterFn', () => {
  it('should match [this: void]', () => {
    expectTypeOf<TestSubject>().thisParameter.toEqualTypeOf<void>()
  })

  describe('parameters', () => {
    it('should be callable with [PreRenderedChunk]', () => {
      expectTypeOf<TestSubject>().parameters.toEqualTypeOf<[PreRenderedChunk]>()
    })
  })

  describe('returns', () => {
    it('should return Promise<string> | string', () => {
      expectTypeOf<TestSubject>()
        .returns
        .toEqualTypeOf<Promise<string> | string>()
    })
  })
})
