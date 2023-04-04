/**
 * @file Type Tests - HelpService
 * @module mkbuild/cli/providers/tests/unit-d/HelpService
 */

import type * as commander from 'commander'
import type TestSubject from '../help.service'

describe('unit-d:cli/providers/HelpService', () => {
  it('should extend commander.Help', () => {
    expectTypeOf<TestSubject>().toMatchTypeOf<commander.Help>()
  })

  it('should match [helpWidth: number]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('helpWidth').toBeNumber()
  })
})
