/**
 * @file Type Tests - GeneratedFileType
 * @module mkbuild/types/tests/unit-d/GeneratedFileType
 */

import type TestSubject from '../generated-file-type'

describe('unit-d:types/GeneratedFileType', () => {
  it('should extract "css"', () => {
    expectTypeOf<TestSubject>().extract<'css'>().not.toBeNever()
  })

  it('should extract "js"', () => {
    expectTypeOf<TestSubject>().extract<'js'>().not.toBeNever()
  })
})
