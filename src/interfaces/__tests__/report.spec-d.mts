/**
 * @file Type Tests - Report
 * @module mkbuild/interfaces/tests/unit-d/Report
 */

import type TestSubject from '#interfaces/report'
import type { Result } from '@flex-development/mkbuild'

describe('unit-d:interfaces/Report', () => {
  it('should match [builds: Result[]]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('builds')
      .toEqualTypeOf<Result[]>()
  })

  it('should match [size: number]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('size').toEqualTypeOf<number>()
  })
})
