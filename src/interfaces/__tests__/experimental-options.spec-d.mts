/**
 * @file Type Tests - ExperimentalOptions
 * @module mkbuild/interfaces/tests/unit-d/ExperimentalOptions
 */

import type TestSubject from '#interfaces/experimental-options'
import type { Nilable } from '@flex-development/tutils'

describe('unit-d:interfaces/ExperimentalOptions', () => {
  it('should match [cacheExpiry?: number | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('cacheExpiry')
      .toEqualTypeOf<Nilable<number>>()
  })

  it('should match [logSideEffects?: boolean | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('logSideEffects')
      .toEqualTypeOf<Nilable<boolean>>()
  })

  it('should match [minChunkSize?: number | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('minChunkSize')
      .toEqualTypeOf<Nilable<number>>()
  })

  it('should match [perf?: boolean | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('perf')
      .toEqualTypeOf<Nilable<boolean>>()
  })
})
