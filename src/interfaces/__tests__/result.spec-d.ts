/**
 * @file Type Tests - Result
 * @module mkbuild/interfaces/tests/unit-d/Result
 */

import type * as esbuild from 'esbuild'
import type Output from '../output'
import type TestSubject from '../result'
import type Task from '../task'

describe('unit-d:interfaces/Result', () => {
  it('should match [cwd: string]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('cwd').toBeString()
  })

  it('should match [errors: esbuild.BuildResult["errors"]]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('errors')
      .toEqualTypeOf<esbuild.BuildResult['errors']>()
  })

  it('should match [mangleCache: esbuild.BuildResult["mangleCache"]]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('mangleCache')
      .toEqualTypeOf<esbuild.BuildResult['mangleCache']>()
  })

  it('should match [metafile: esbuild.Metafile]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('metafile')
      .toEqualTypeOf<esbuild.Metafile>()
  })

  it('should match [outdir: Task["outdir"]]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('outdir')
      .toEqualTypeOf<Task['outdir']>()
  })

  it('should match [outputs: Output[]]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('outputs')
      .toEqualTypeOf<Output[]>()
  })

  it('should match [warnings: esbuild.BuildResult["warnings"]]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('warnings')
      .toEqualTypeOf<esbuild.BuildResult['warnings']>()
  })
})
