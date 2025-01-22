/**
 * @file Type Tests - ResolveOptions
 * @module mkbuild/interfaces/tests/unit-d/ResolveOptions
 */

import type { Skip, default as TestSubject } from '#interfaces/resolve-options'
import type { ResolveModuleOptions } from '@flex-development/mlly'
import type { Nilable } from '@flex-development/tutils'

describe('unit-d:interfaces/ResolveOptions', () => {
  it('should extend Omit<ResolveModuleOptions, Skip>', () => {
    expectTypeOf<TestSubject>()
      .toMatchTypeOf<Omit<ResolveModuleOptions, Skip>>()
  })

  it('should match [conditions?: Set<string> | string[] | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('conditions')
      .toEqualTypeOf<Nilable<Set<string> | string[]>>()
  })

  it('should match [extensions?: Set<string> | string[] | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('extensions')
      .toEqualTypeOf<Nilable<Set<string> | string[]>>()
  })

  it('should match [mainFields?: Set<string> | string[] | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('mainFields')
      .toEqualTypeOf<Nilable<Set<string> | string[]>>()
  })
})
