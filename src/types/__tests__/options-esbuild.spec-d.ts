/**
 * @file Type Tests - EsbuildOptions
 * @module mkbuild/types/tests/unit-d/EsbuildOptions
 */

import type * as esbuild from 'esbuild'
import type TestSubject from '../options-esbuild'

describe('unit-d:types/EsbuildOptions', () => {
  it('should match type of esbuild.BuildOptions', () => {
    expectTypeOf<TestSubject>().toMatchTypeOf<esbuild.BuildOptions>()
  })

  it('should omit "absWorkingDir"', () => {
    expectTypeOf<TestSubject>().not.toHaveProperty('absWorkingDir')
  })

  it('should omit "conditions"', () => {
    expectTypeOf<TestSubject>().not.toHaveProperty('conditions')
  })

  it('should omit "entryNames"', () => {
    expectTypeOf<TestSubject>().not.toHaveProperty('entryNames')
  })

  it('should omit "entryPoints"', () => {
    expectTypeOf<TestSubject>().not.toHaveProperty('entryPoints')
  })

  it('should omit "incremental"', () => {
    expectTypeOf<TestSubject>().not.toHaveProperty('incremental')
  })

  it('should omit "mainFields"', () => {
    expectTypeOf<TestSubject>().not.toHaveProperty('mainFields')
  })

  it('should omit "metafile"', () => {
    expectTypeOf<TestSubject>().not.toHaveProperty('metafile')
  })

  it('should omit "outfile"', () => {
    expectTypeOf<TestSubject>().not.toHaveProperty('outfile')
  })

  it('should omit "resolveExtensions"', () => {
    expectTypeOf<TestSubject>().not.toHaveProperty('resolveExtensions')
  })

  it('should omit "stdin"', () => {
    expectTypeOf<TestSubject>().not.toHaveProperty('stdin')
  })

  it('should omit "watch"', () => {
    expectTypeOf<TestSubject>().not.toHaveProperty('watch')
  })
})
