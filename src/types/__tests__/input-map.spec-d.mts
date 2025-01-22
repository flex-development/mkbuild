/**
 * @file Type Tests - InputMap
 * @module mkbuild/types/tests/unit-d/InputMap
 */

import type TestSubject from '#types/input-map'
import type { InputFile } from '@flex-development/mkbuild'

describe('unit-d:types/InputMap', () => {
  it('should equal Record<string, InputFile>', () => {
    expectTypeOf<TestSubject>().toEqualTypeOf<Record<string, InputFile>>()
  })
})
