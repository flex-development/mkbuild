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
import type { OneOrMany, Optional } from '@flex-development/tutils'
import type * as esbuild from 'esbuild'
import type TestSubject from '../options'

describe('unit-d:interfaces/Options', () => {
  it('should extend EsbuildOptions', () => {
    expectTypeOf<TestSubject>().toMatchTypeOf<EsbuildOptions>()
  })

  it('should match [banner?: { [K in GeneratedFileType]?: string }]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('banner')
      .toEqualTypeOf<Optional<{ [K in GeneratedFileType]?: string }>>()
  })

  it('should match [clean?: boolean]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('clean')
      .toEqualTypeOf<Optional<boolean>>()
  })

  it('should match [conditions?: Set<string> | string[]]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('conditions')
      .toEqualTypeOf<Optional<Set<string> | string[]>>()
  })

  it('should match [createRequire?: boolean]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('createRequire')
      .toEqualTypeOf<Optional<boolean>>()
  })

  it('should match [cwd?: string]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('cwd')
      .toEqualTypeOf<Optional<string>>()
  })

  it('should match [dts?: boolean | "only"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('dts')
      .toEqualTypeOf<Optional<boolean | 'only'>>()
  })

  it('should match [ext?: OutputExtension]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('ext')
      .toEqualTypeOf<Optional<OutputExtension>>()
  })

  it('should match [footer?: { [K in GeneratedFileType]?: string }]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('footer')
      .toEqualTypeOf<Optional<{ [K in GeneratedFileType]?: string }>>()
  })

  it('should match [ignore?: Set<string> | string[]]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('ignore')
      .toEqualTypeOf<Optional<Set<string> | string[]>>()
  })

  it('should match [loader?: Record<pathe.Ext, esbuild.Loader>]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('loader')
      .toEqualTypeOf<Optional<Record<pathe.Ext, esbuild.Loader>>>()
  })

  it('should match [mainFields?: Set<string> | string[]]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('mainFields')
      .toEqualTypeOf<Optional<Set<string> | string[]>>()
  })

  it('should match [name?: string]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('name')
      .toEqualTypeOf<Optional<string>>()
  })

  it('should match [outExtension?: Record<pathe.Ext, pathe.Ext>]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('outExtension')
      .toEqualTypeOf<Optional<Record<pathe.Ext, pathe.Ext>>>()
  })

  it('should match [pattern?: OneOrMany<string> | Set<string>]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('pattern')
      .toEqualTypeOf<Optional<OneOrMany<string> | Set<string>>>()
  })

  it('should match [resolveExtensions?: Set<string> | string[]]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('resolveExtensions')
      .toEqualTypeOf<Optional<Set<string> | string[]>>()
  })

  it('should match [source?: string]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('source')
      .toEqualTypeOf<Optional<string>>()
  })
})
