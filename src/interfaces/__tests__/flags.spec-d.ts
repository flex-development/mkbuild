/**
 * @file Type Tests - Flags
 * @module mkbuild/interfaces/tests/unit-d/Flags
 */

import type TestSubject from '../flags'
import type Options from '../options'

describe('unit-d:interfaces/Flags', () => {
  it('should extend Omit<Options, "nodePaths">', () => {
    expectTypeOf<TestSubject>().toMatchTypeOf<Omit<Options, 'nodePaths'>>()
  })

  it('should match [help?: boolean]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('help')
      .toEqualTypeOf<boolean | undefined>()
  })

  it('should match [version?: boolean]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('version')
      .toEqualTypeOf<boolean | undefined>()
  })

  it('should match [watch?: boolean]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('watch')
      .toEqualTypeOf<boolean | undefined>()
  })
})
