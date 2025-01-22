/**
 * @file Type Tests - RollupCode
 * @module mkbuild/types/tests/unit-d/RollupCode
 */

import type TestSubject from '#types/rollup-code'
import type { RollupCodeMap } from '@flex-development/mkbuild'

describe('unit-d:types/RollupCode', () => {
  it('should equal keyof RollupCodeMap', () => {
    expectTypeOf<TestSubject>().toEqualTypeOf<keyof RollupCodeMap>()
  })
})
