/**
 * @file Type Tests - Output
 * @module mkbuild/interfaces/tests/unit-d/Output
 */

import type { OutputMetadata } from '#src/types'
import type * as esbuild from 'esbuild'
import type TestSubject from '../output'

describe('unit-d:interfaces/Output', () => {
  it('should extend esbuild.OutputFile', () => {
    expectTypeOf<TestSubject>().toMatchTypeOf<esbuild.OutputFile>()
  })

  it('should match [bytes: OutputMetadata["bytes"]]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('bytes')
      .toEqualTypeOf<OutputMetadata['bytes']>()
  })

  it('should match [entryPoint: OutputMetadata["entryPoint"]]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('entryPoint')
      .toEqualTypeOf<OutputMetadata['entryPoint']>()
  })

  it('should match [exports: OutputMetadata["exports"]]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('exports')
      .toEqualTypeOf<OutputMetadata['exports']>()
  })

  it('should match [imports: OutputMetadata["imports"]]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('imports')
      .toEqualTypeOf<OutputMetadata['imports']>()
  })

  it('should match [outfile: string]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('outfile').toBeString()
  })
})
