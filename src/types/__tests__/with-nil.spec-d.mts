/**
 * @file Type Tests - WithNil
 * @module mkbuild/types/tests/unit-d/WithNil
 */

import type TestSubject from '#types/with-nil'
import type { Nilable } from '@flex-development/tutils'

describe('unit-d:types/WithNil', () => {
  type Value = string

  it('should add `null | undefined` to each property in `T` (0)', () => {
    // Arrange
    type T = { 0: Value; 1: Value }
    type Expect = { 0: Nilable<Value>; 1: Nilable<Value> }

    // Expect
    expectTypeOf<TestSubject<T>>().toEqualTypeOf<Expect>()
  })

  it('should add `null | undefined` to each property in `T` (0)', () => {
    // Arrange
    type T = { 0?: Value; 1?: Value }
    type Expect = { 0?: Nilable<Value>; 1?: Nilable<Value> }

    // Expect
    expectTypeOf<TestSubject<T>>().toEqualTypeOf<Expect>()
  })
})
