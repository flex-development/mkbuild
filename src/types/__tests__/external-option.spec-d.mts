/**
 * @file Type Tests - ExternalOption
 * @module mkbuild/types/tests/unit-d/ExternalOption
 */

import type TestSubject from '#types/external-option'
import type { IsExternal } from '@flex-development/mkbuild'

describe('unit-d:types/ExternalOption', () => {
  it('should extract (RegExp | string)[]', () => {
    expectTypeOf<TestSubject>().extract<(RegExp | string)[]>().not.toBeNever()
  })

  it('should extract IsExternal', () => {
    expectTypeOf<TestSubject>().extract<IsExternal>().not.toBeNever()
  })

  it('should extract RegExp', () => {
    expectTypeOf<TestSubject>().extract<RegExp>().not.toBeNever()
  })

  it('should extract string', () => {
    expectTypeOf<TestSubject>().extract<string>().not.toBeNever()
  })
})
