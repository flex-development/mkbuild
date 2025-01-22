/**
 * @file Type Tests - ResolveIdOptions
 * @module mkbuild/interfaces/tests/unit-d/ResolveIdOptions
 */

import type TestSubject from '#interfaces/resolve-id-options'
import type { Optional } from '@flex-development/tutils'
import type { CustomPluginOptions } from 'rollup'

describe('unit-d:interfaces/ResolveIdOptions', () => {
  it('should match [attributes: Record<string, string>]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('attributes')
      .toEqualTypeOf<Record<string, string>>()
  })

  it('should match [custom?: CustomPluginOptions | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('custom')
      .toEqualTypeOf<Optional<CustomPluginOptions>>()
  })

  it('should match [isEntry: boolean]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('isEntry')
      .toEqualTypeOf<boolean>()
  })
})
