/**
 * @file Type Tests - LegalComments
 * @module mkbuild/types/tests/unit-d/LegalComments
 */

import type TestSubject from '../legal-comments'

describe('unit-d:types/LegalComments', () => {
  it('should extract "eof"', () => {
    expectTypeOf<TestSubject>().extract<'eof'>().not.toBeNever()
  })

  it('should extract "external"', () => {
    expectTypeOf<TestSubject>().extract<'external'>().not.toBeNever()
  })

  it('should extract "inline"', () => {
    expectTypeOf<TestSubject>().extract<'inline'>().not.toBeNever()
  })

  it('should extract "linked"', () => {
    expectTypeOf<TestSubject>().extract<'linked'>().not.toBeNever()
  })

  it('should extract "none"', () => {
    expectTypeOf<TestSubject>().extract<'none'>().not.toBeNever()
  })
})
