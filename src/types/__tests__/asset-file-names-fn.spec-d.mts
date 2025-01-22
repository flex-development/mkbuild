/**
 * @file Type Tests - AssetFileNamesFn
 * @module mkbuild/types/tests/unit-d/AssetFileNamesFn
 */

import type TestSubject from '#types/asset-file-names-fn'
import type { PreRenderedAsset } from 'rollup'

describe('unit-d:types/AssetFileNamesFn', () => {
  it('should match [this: void]', () => {
    expectTypeOf<TestSubject>().thisParameter.toEqualTypeOf<void>()
  })

  describe('parameters', () => {
    it('should be callable with [PreRenderedAsset]', () => {
      expectTypeOf<TestSubject>().parameters.toEqualTypeOf<[PreRenderedAsset]>()
    })
  })

  describe('returns', () => {
    it('should return string', () => {
      expectTypeOf<TestSubject>().returns.toEqualTypeOf<string>()
    })
  })
})
