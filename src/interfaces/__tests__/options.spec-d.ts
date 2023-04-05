/**
 * @file Type Tests - Options
 * @module mkbuild/interfaces/tests/unit-d/Options
 */

import type {
  EsbuildOptions,
  GeneratedFileType,
  OutputExtension
} from '#src/types'
import type * as pathe from '@flex-development/pathe'
import type { OneOrMany } from '@flex-development/tutils'
import type * as esbuild from 'esbuild'
import type TestSubject from '../options'

describe('unit-d:interfaces/Options', () => {
  it('should extend EsbuildOptions', () => {
    expectTypeOf<TestSubject>().toMatchTypeOf<EsbuildOptions>()
  })

  it('should match [banner?: { [K in GeneratedFileType]?: string }]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('banner')
      .toEqualTypeOf<{ [K in GeneratedFileType]?: string } | undefined>()
  })

  it('should match [clean?: boolean]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('clean')
      .toEqualTypeOf<boolean | undefined>()
  })

  it('should match [conditions?: Set<string> | string[]]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('conditions')
      .toEqualTypeOf<Set<string> | string[] | undefined>()
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

  it('should match [footer?: { [K in GeneratedFileType]?: string }]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('footer')
      .toEqualTypeOf<{ [K in GeneratedFileType]?: string } | undefined>()
  })

  it('should match [ignore?: Set<string> | string[]]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('ignore')
      .toEqualTypeOf<Set<string> | string[] | undefined>()
  })

  it('should match [loader?: Record<pathe.Ext, esbuild.Loader>]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('loader')
      .toEqualTypeOf<Record<pathe.Ext, esbuild.Loader> | undefined>()
  })

  it('should match [mainFields?: Set<string> | string[]]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('mainFields')
      .toEqualTypeOf<Set<string> | string[] | undefined>()
  })

  it('should match [name?: string]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('name')
      .toEqualTypeOf<string | undefined>()
  })

  it('should match [outExtension?: Record<pathe.Ext, pathe.Ext>]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('outExtension')
      .toEqualTypeOf<Record<pathe.Ext, pathe.Ext> | undefined>()
  })

  it('should match [pattern?: OneOrMany<string> | Set<string>]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('pattern')
      .toEqualTypeOf<OneOrMany<string> | Set<string> | undefined>()
  })

  it('should match [resolveExtensions?: Set<string> | string[]]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('resolveExtensions')
      .toEqualTypeOf<Set<string> | string[] | undefined>()
  })

  it('should match [source?: string]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('source')
      .toEqualTypeOf<string | undefined>()
  })
})
