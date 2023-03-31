/**
 * @file Type Tests - Task
 * @module mkbuild/interfaces/tests/unit-d/Task
 */

import type { EsbuildOptions } from '#src/types'
import type Options from '../options'
import type TestSubject from '../task'

describe('unit-d:interfaces/Task', () => {
  it('should extend EsbuildOptions', () => {
    expectTypeOf<TestSubject>().toMatchTypeOf<EsbuildOptions>()
  })

  it('should extend Options', () => {
    expectTypeOf<TestSubject>().toMatchTypeOf<Options>()
  })

  it('should match [cwd: string]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('cwd').toBeString()
  })

  it('should match [outdir: string]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('outdir').toBeString()
  })

  it('should match [source: string]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('source').toBeString()
  })
})
