/**
 * @file Type Tests - InputMap
 * @module mkbuild/interfaces/tests/unit-d/InputMap
 */

import type TestSubject from '#interfaces/input-map'
import type { InputFile } from '@flex-development/mkbuild'

describe('unit-d:interfaces/InputMap', () => {
  it('should match Record<string, InputFile>', () => {
    expectTypeOf<TestSubject>().toMatchTypeOf<Record<string, InputFile>>()
  })
})
