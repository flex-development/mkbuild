/**
 * @file Type Tests - defineBuildConfig
 * @module mkbuild/utils/tests/unit-d/defineBuildConfig
 */

import type { Config } from '#src/interfaces'
import type testSubject from '../define-build-config'

describe('unit-d:utils/defineBuildConfig', () => {
  it('should be callable with [Config | undefined]', () => {
    // Arrange
    type Expected = [config?: Config | undefined]

    // Expect
    expectTypeOf<typeof testSubject>().parameters.toEqualTypeOf<Expected>()
  })

  it('should return Config', () => {
    expectTypeOf<typeof testSubject>().returns.toEqualTypeOf<Config>()
  })
})
