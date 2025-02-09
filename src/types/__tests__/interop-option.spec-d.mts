/**
 * @file Type Tests - InteropOption
 * @module mkbuild/types/tests/unit-d/InteropOption
 */

import type TestSubject from '#types/interop-option'
import type { GetInterop } from '@flex-development/mkbuild'
import type { InteropType } from 'rollup'

describe('unit-d:types/InteropOption', () => {
  it('should extract GetInterop', () => {
    expectTypeOf<TestSubject>().extract<GetInterop>().not.toBeNever()
  })

  it('should extract InteropType', () => {
    expectTypeOf<TestSubject>().extract<InteropType>().not.toBeNever()
  })
})
