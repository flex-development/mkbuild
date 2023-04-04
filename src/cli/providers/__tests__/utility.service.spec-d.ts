/**
 * @file Type Tests - UtilityService
 * @module mkbuild/cli/providers/tests/unit-d/UtilityService
 */

import type { CliUtilityService } from 'nest-commander'
import type TestSubject from '../utility.service'

describe('unit-d:cli/providers/UtilityService', () => {
  it('should extend CliUtilityService', () => {
    expectTypeOf<TestSubject>().toMatchTypeOf<CliUtilityService>()
  })
})
