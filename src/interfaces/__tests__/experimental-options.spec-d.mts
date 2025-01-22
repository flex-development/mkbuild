/**
 * @file Type Tests - ExperimentalOptions
 * @module mkbuild/interfaces/tests/unit-d/ExperimentalOptions
 */

import type TestSubject from '#interfaces/experimental-options'
import type { Nilable } from '@flex-development/tutils'

describe('unit-d:interfaces/ExperimentalOptions', () => {
  it('should match [perf?: boolean | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('perf')
      .toEqualTypeOf<Nilable<boolean>>()
  })
})
