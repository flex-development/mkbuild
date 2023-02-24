/**
 * @file Type Tests - Options
 * @module mkbuild/interfaces/tests/unit-d/Options
 */

import type { EsbuildOptions, OutputExtension } from '#src/types'
import type { OneOrMany } from '@flex-development/tutils'
import type * as esbuild from 'esbuild'
import type TestSubject from '../options'

describe('unit-d:interfaces/Options', () => {
  it('should extend EsbuildOptions', () => {
    expectTypeOf<TestSubject>().toMatchTypeOf<EsbuildOptions>()
  })

  it('should match [bundle?: boolean]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('bundle')
      .toEqualTypeOf<boolean | undefined>()
  })

  it('should match [createRequire?: boolean]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('createRequire')
      .toEqualTypeOf<boolean | undefined>()
  })

  it('should match [cwd?: string]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('cwd')
      .toEqualTypeOf<string | undefined>()
  })

  it('should match [dts?: boolean | "only"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('dts')
      .toEqualTypeOf<boolean | 'only' | undefined>()
  })

  it('should match [ext?: OutputExtension]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('ext')
      .toEqualTypeOf<OutputExtension | undefined>()
  })

  it('should match [format?: esbuild.Format]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('format')
      .toEqualTypeOf<esbuild.Format | undefined>()
  })

  it('should match [ignore?: string[]]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('ignore')
      .toEqualTypeOf<string[] | undefined>()
  })

  it('should match [name?: string]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('name')
      .toEqualTypeOf<string | undefined>()
  })

  it('should match [outdir?: string]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('outdir')
      .toEqualTypeOf<string | undefined>()
  })

  it('should match [pattern?: OneOrMany<string>]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('pattern')
      .toEqualTypeOf<OneOrMany<string> | undefined>()
  })

  it('should match [source?: string]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('source')
      .toEqualTypeOf<string | undefined>()
  })

  it('should match [write?: boolean]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('write')
      .toEqualTypeOf<boolean | undefined>()
  })
})
