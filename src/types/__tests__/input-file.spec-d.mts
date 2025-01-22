/**
 * @file Type Tests - InputFile
 * @module mkbuild/types/tests/unit-d/InputFile
 */

import type TestSubject from '#types/input-file'

describe('unit-d:types/InputFile', () => {
  it('should equal string', () => {
    expectTypeOf<TestSubject>().toEqualTypeOf<string>()
  })
})
