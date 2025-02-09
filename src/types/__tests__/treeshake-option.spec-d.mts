/**
 * @file Type Tests - TreeshakeOption
 * @module mkbuild/types/tests/unit-d/TreeshakeOption
 */

import type TestSubject from '#types/treeshake-option'
import type { TreeshakingOptions, TreeshakingPreset } from 'rollup'

describe('unit-d:types/TreeshakeOption', () => {
  it('should extract TreeshakingOptions', () => {
    expectTypeOf<TestSubject>().extract<TreeshakingOptions>().not.toBeNever()
  })

  it('should extract TreeshakingPreset', () => {
    expectTypeOf<TestSubject>().extract<TreeshakingPreset>().not.toBeNever()
  })

  it('should extract boolean', () => {
    expectTypeOf<TestSubject>().extract<boolean>().not.toBeNever()
  })
})
