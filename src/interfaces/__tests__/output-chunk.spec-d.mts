/**
 * @file Type Tests - OutputChunk
 * @module mkbuild/interfaces/tests/unit-d/OutputChunk
 */

import type TestSubject from '#interfaces/output-chunk'
import type * as rollup from 'rollup'

describe('unit-d:interfaces/OutputChunk', () => {
  it('should extend rollup.OutputChunk', () => {
    expectTypeOf<TestSubject>().toMatchTypeOf<rollup.OutputChunk>()
  })

  it('should match [bytes: number]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('bytes').toEqualTypeOf<number>()
  })
})
