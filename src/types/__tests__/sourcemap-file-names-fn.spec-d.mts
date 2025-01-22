/**
 * @file Type Tests - SourcemapFileNamesFn
 * @module mkbuild/types/tests/unit-d/SourcemapFileNamesFn
 */

import type TestSubject from '#types/sourcemap-file-names-fn'
import type { PreRenderedChunk } from 'rollup'

describe('unit-d:types/SourcemapFileNamesFn', () => {
  it('should match [this: void]', () => {
    expectTypeOf<TestSubject>().thisParameter.toEqualTypeOf<void>()
  })

  describe('parameters', () => {
    it('should be callable with [PreRenderedChunk]', () => {
      expectTypeOf<TestSubject>().parameters.toEqualTypeOf<[PreRenderedChunk]>()
    })
  })

  describe('returns', () => {
    it('should return string', () => {
      expectTypeOf<TestSubject>().returns.toEqualTypeOf<string>()
    })
  })
})
