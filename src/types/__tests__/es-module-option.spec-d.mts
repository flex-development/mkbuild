/**
 * @file Type Tests - EsModuleOption
 * @module mkbuild/types/tests/unit-d/EsModuleOption
 */

import type TestSubject from '#types/es-module-option'

describe('unit-d:types/EsModuleOption', () => {
  it('should extract "if-default-prop"', () => {
    expectTypeOf<TestSubject>().extract<'if-default-prop'>().not.toBeNever()
  })

  it('should extract boolean', () => {
    expectTypeOf<TestSubject>().extract<boolean>().not.toBeNever()
  })
})
