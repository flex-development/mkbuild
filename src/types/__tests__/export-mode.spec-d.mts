/**
 * @file Type Tests - ExportMode
 * @module mkbuild/types/tests/unit-d/ExportMode
 */

import type TestSubject from '#types/export-mode'

describe('unit-d:types/ExportMode', () => {
  it('should extract "auto"', () => {
    expectTypeOf<TestSubject>().extract<'auto'>().not.toBeNever()
  })

  it('should extract "default"', () => {
    expectTypeOf<TestSubject>().extract<'default'>().not.toBeNever()
  })

  it('should extract "named"', () => {
    expectTypeOf<TestSubject>().extract<'named'>().not.toBeNever()
  })

  it('should extract "none"', () => {
    expectTypeOf<TestSubject>().extract<'none'>().not.toBeNever()
  })
})
