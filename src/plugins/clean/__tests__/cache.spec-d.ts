/**
 * @file Type Tests - CLEAN_CACHE
 * @module mkbuild/plugins/tests/unit-d/clean/CLEAN_CACHE
 */

import type TestSubject from '../cache'

describe('unit-d:plugins/clean/CLEAN_CACHE', () => {
  it('should be instance Map<string, true>', () => {
    expectTypeOf<typeof TestSubject>().toEqualTypeOf<Map<string, true>>()
  })
})
