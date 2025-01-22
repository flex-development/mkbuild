/**
 * @file Type Tests - ResolvedConfig
 * @module mkbuild/interfaces/tests/unit-d/ResolvedConfig
 */

import type TestSubject from '#interfaces/config-resolved'
import type { Config } from '@flex-development/mkbuild'
import type { Nullable } from '@flex-development/tutils'

describe('unit-d:interfaces/ResolvedConfig', () => {
  it('should match [config: Config]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('config').toEqualTypeOf<Config>()
  })

  it('should match [url: URL | null]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('url')
      .toEqualTypeOf<Nullable<URL>>()
  })
})
