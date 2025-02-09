/**
 * @file Type Tests - ModuleContextMap
 * @module mkbuild/interfaces/tests/unit-d/ModuleContextMap
 */

import type TestSubject from '#interfaces/module-context-map'

describe('unit-d:interfaces/ModuleContextMap', () => {
  it('should match Record<string, string>', () => {
    expectTypeOf<TestSubject>().toMatchTypeOf<Record<string, string>>()
  })
})
