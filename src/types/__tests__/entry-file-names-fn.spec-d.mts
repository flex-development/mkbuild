/**
 * @file Type Tests - EntryFileNamesFn
 * @module mkbuild/types/tests/unit-d/EntryFileNamesFn
 */

import type TestSubject from '#types/entry-file-names-fn'
import type { PreRenderedChunk } from 'rollup'

describe('unit-d:types/EntryFileNamesFn', () => {
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
