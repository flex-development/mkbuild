/**
 * @file Type Tests - OutputAsset
 * @module mkbuild/interfaces/tests/unit-d/OutputAsset
 */

import type TestSubject from '#interfaces/output-asset'
import type * as rollup from 'rollup'

describe('unit-d:interfaces/OutputAsset', () => {
  it('should extend rollup.OutputAsset', () => {
    expectTypeOf<TestSubject>().toMatchTypeOf<rollup.OutputAsset>()
  })

  it('should match [bytes: number]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('bytes').toEqualTypeOf<number>()
  })
})
