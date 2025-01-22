/**
 * @file Type Tests - Input
 * @module mkbuild/types/tests/unit-d/Input
 */

import type TestSubject from '#types/input'
import type { InputFile, InputList, InputMap } from '@flex-development/mkbuild'

describe('unit-d:types/Input', () => {
  it('should extract InputFile', () => {
    expectTypeOf<TestSubject>().extract<InputFile>().not.toBeNever()
  })

  it('should extract InputList', () => {
    expectTypeOf<TestSubject>().extract<InputList>().not.toBeNever()
  })

  it('should extract InputMap', () => {
    expectTypeOf<TestSubject>().extract<InputMap>().not.toBeNever()
  })
})
