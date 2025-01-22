/**
 * @file Type Tests - BannerFn
 * @module mkbuild/types/tests/unit-d/BannerFn
 */

import type TestSubject from '#types/banner-fn'
import type { PreRenderedChunk } from 'rollup'

describe('unit-d:types/BannerFn', () => {
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
