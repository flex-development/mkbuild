/**
 * @file Type Tests - Flags
 * @module mkbuild/interfaces/tests/unit-d/Flags
 */

import type { Omit, Optional } from '@flex-development/tutils'
import type TestSubject from '../flags'
import type Options from '../options'

describe('unit-d:interfaces/Flags', () => {
  it('should extend Omit<Options, "nodePaths">', () => {
    expectTypeOf<TestSubject>().toMatchTypeOf<Omit<Options, 'nodePaths'>>()
  })

  it('should match [help?: boolean]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('help')
      .toEqualTypeOf<Optional<boolean>>()
  })

  it('should match [version?: boolean]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('version')
      .toEqualTypeOf<Optional<boolean>>()
  })

  it('should match [watch?: boolean]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('watch')
      .toEqualTypeOf<Optional<boolean>>()
  })
})
