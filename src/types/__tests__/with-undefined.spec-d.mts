/**
 * @file Type Tests - WithUndefined
 * @module mkbuild/types/tests/unit-d/WithUndefined
 */

import type TestSubject from '#types/with-undefined'
import type { Optional } from '@flex-development/tutils'

describe('unit-d:types/WithUndefined', () => {
  type Value = string

  it('should add `undefined` to each property in `T` (0)', () => {
    // Arrange
    type T = { 0: Value; 1: Value }
    type Expect = { 0: Optional<Value>; 1: Optional<Value> }

    // Expect
    expectTypeOf<TestSubject<T>>().toEqualTypeOf<Expect>()
  })

  it('should add `undefined` to each property in `T` (1)', () => {
    // Arrange
    type T = { 0?: Value; 1?: Value }
    type Expect = { 0?: Optional<Value>; 1?: Optional<Value> }

    // Expect
    expectTypeOf<TestSubject<T>>().toEqualTypeOf<Expect>()
  })
})
