/**
 * @file Type Tests - LegalComments
 * @module mkbuild/types/tests/unit-d/LegalComments
 */

import type TestSubject from '../legal-comments'

describe('unit-d:types/LegalComments', () => {
  it('should extract "eof"', () => {
    expectTypeOf<TestSubject>().extract<'eof'>().toBeString()
  })

  it('should extract "external"', () => {
    expectTypeOf<TestSubject>().extract<'external'>().toBeString()
  })

  it('should extract "inline"', () => {
    expectTypeOf<TestSubject>().extract<'inline'>().toBeString()
  })

  it('should extract "linked"', () => {
    expectTypeOf<TestSubject>().extract<'linked'>().toBeString()
  })

  it('should extract "none"', () => {
    expectTypeOf<TestSubject>().extract<'none'>().toBeString()
  })
})
