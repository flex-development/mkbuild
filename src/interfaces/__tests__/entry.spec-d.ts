/**
 * @file Type Tests - Entry
 * @module mkbuild/interfaces/tests/unit-d/Entry
 */

import type { EsbuildOptions } from '#src/types'
import type TestSubject from '../entry'
import type Options from '../options'

describe('unit-d:interfaces/Entry', () => {
  it('should extend EsbuildOptions', () => {
    expectTypeOf<TestSubject>().toMatchTypeOf<EsbuildOptions>()
  })

  it('should extend Options', () => {
    expectTypeOf<TestSubject>().toMatchTypeOf<Options>()
  })

  it('should match [outdir: string]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('outdir').toBeString()
  })

  it('should match [source: string]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('source').toBeString()
  })
})
