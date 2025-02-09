/**
 * @file Type Tests - GeneratedCodeOption
 * @module mkbuild/types/tests/unit-d/GeneratedCodeOption
 */

import type TestSubject from '#types/generated-code-option'
import type { GeneratedCodeOptions, GeneratedCodePreset } from 'rollup'

describe('unit-d:types/GeneratedCodeOption', () => {
  it('should extract GeneratedCodeOptions', () => {
    expectTypeOf<TestSubject>().extract<GeneratedCodeOptions>().not.toBeNever()
  })

  it('should extract GeneratedCodePreset', () => {
    expectTypeOf<TestSubject>().extract<GeneratedCodePreset>().not.toBeNever()
  })
})
