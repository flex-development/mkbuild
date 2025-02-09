/**
 * @file Type Tests - ModuleContextOption
 * @module mkbuild/types/tests/unit-d/ModuleContextOption
 */

import type TestSubject from '#types/module-context-option'
import type {
  GetModuleContext,
  ModuleContextMap
} from '@flex-development/mkbuild'

describe('unit-d:types/ModuleContextOption', () => {
  it('should extract GetModuleContext', () => {
    expectTypeOf<TestSubject>().extract<GetModuleContext>().not.toBeNever()
  })

  it('should extract ModuleContextMap', () => {
    expectTypeOf<TestSubject>().extract<ModuleContextMap>().not.toBeNever()
  })

  it('should extract string', () => {
    expectTypeOf<TestSubject>().extract<string>().not.toBeNever()
  })
})
