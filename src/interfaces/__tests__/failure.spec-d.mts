/**
 * @file Type Tests - Failure
 * @module mkbuild/interfaces/tests/unit-d/Failure
 */

import type TestSubject from '#interfaces/failure'
import type { Message } from '@flex-development/mkbuild'

describe('unit-d:interfaces/Failure', () => {
  it('should extend Message', () => {
    expectTypeOf<TestSubject>().toMatchTypeOf<Message>()
  })

  it('should match [level: "error"]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('level').toEqualTypeOf<'error'>()
  })
})
