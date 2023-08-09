/**
 * @file Type Tests - defineBuildConfig
 * @module mkbuild/utils/tests/unit-d/defineBuildConfig
 */

import type { Config } from '#src/interfaces'
import type { Optional } from '@flex-development/tutils'
import type testSubject from '../define-build-config'

describe('unit-d:utils/defineBuildConfig', () => {
  it('should be callable with [Optional<Config>]', () => {
    // Arrange
    type Expect = [config?: Optional<Config>]

    // Expect
    expectTypeOf<typeof testSubject>().parameters.toEqualTypeOf<Expect>()
  })

  it('should return Config', () => {
    expectTypeOf<typeof testSubject>().returns.toEqualTypeOf<Config>()
  })
})
