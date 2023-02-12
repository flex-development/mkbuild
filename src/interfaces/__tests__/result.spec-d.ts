/**
 * @file Type Tests - Result
 * @module mkbuild/interfaces/tests/unit-d/Result
 */

import type { OutputMetadata } from '#src/types'
import type * as esbuild from 'esbuild'
import type TestSubject from '../result'

describe('unit-d:interfaces/Options', () => {
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

  it('should match [errors: esbuild.BuildResult["errors"]]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('errors')
      .toEqualTypeOf<esbuild.BuildResult['errors']>()
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

  it('should match [inputs: esbuild.Metafile["inputs"]]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('inputs')
      .toEqualTypeOf<esbuild.Metafile['inputs']>()
  })

  it('should match [outfile: string]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('outfile').toBeString()
  })

  it('should match [warnings: esbuild.BuildResult["warnings"]]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('warnings')
      .toEqualTypeOf<esbuild.BuildResult['warnings']>()
  })
})
