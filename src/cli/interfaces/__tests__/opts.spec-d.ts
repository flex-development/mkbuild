/**
 * @file Type Tests - Opts
 * @module mkbuild/cli/interfaces/tests/unit-d/Opts
 *
 * @todo update tests
 */

import type { Options } from '#src/interfaces'
import type { Omit } from '@flex-development/tutils'
import type TestSubject from '../opts'

describe('unit-d:cli/interfaces/Opts', () => {
  it('should extend Omit<Options, "nodePaths">', () => {
    expectTypeOf<TestSubject>().toMatchTypeOf<Omit<Options, 'nodePaths'>>()
  })

  it('should match [watch: boolean]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('watch').toEqualTypeOf<boolean>()
  })
})
