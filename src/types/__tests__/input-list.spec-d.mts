/**
 * @file Type Tests - InputList
 * @module mkbuild/types/tests/unit-d/InputList
 */

import type TestSubject from '#types/input-list'

describe('unit-d:types/InputList', () => {
  it('should equal string[]', () => {
    expectTypeOf<TestSubject>().toEqualTypeOf<string[]>()
  })
})
