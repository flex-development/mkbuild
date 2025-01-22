/**
 * @file Type Tests - EsbuildOptions
 * @module mkbuild/interfaces/tests/unit-d/EsbuildOptions
 */

import type TestSubject from '#interfaces/esbuild-options'
import type { JsxTransform } from '@flex-development/mkbuild'
import type { EmptyString, Ext } from '@flex-development/pathe'
import type { Tsconfig } from '@flex-development/tsconfig-types'
import type { Nilable } from '@flex-development/tutils'
import type { FilterPattern } from '@rollup/pluginutils'
import type { Charset, Drop, Loader, LogLevel, Platform } from 'esbuild'

describe('unit-d:interfaces/EsbuildOptions', () => {
  it('should match [charset?: Charset | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('charset')
      .toEqualTypeOf<Nilable<Charset>>()
  })

  it('should match [define?: { [key: string]: string } | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('define')
      .toEqualTypeOf<Nilable<{ [key: string]: string }>>()
  })

  it('should match [drop?: Drop[] | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('drop')
      .toEqualTypeOf<Nilable<Drop[]>>()
  })

  it('should match [dropLabels?: string[] | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('dropLabels')
      .toEqualTypeOf<Nilable<string[]>>()
  })

  it('should match [exclude?: FilterPattern | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('exclude')
      .toEqualTypeOf<Nilable<FilterPattern>>()
  })

  it('should match [include?: FilterPattern | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('include')
      .toEqualTypeOf<Nilable<FilterPattern>>()
  })

  it('should match [jsx?: JsxTransform | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('jsx')
      .toEqualTypeOf<Nilable<JsxTransform>>()
  })

  it('should match [jsxDev?: boolean | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('jsxDev')
      .toEqualTypeOf<Nilable<boolean>>()
  })

  it('should match [jsxFactory?: string | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('jsxFactory')
      .toEqualTypeOf<Nilable<string>>()
  })

  it('should match [jsxFragment?: string | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('jsxFragment')
      .toEqualTypeOf<Nilable<string>>()
  })

  it('should match [jsxImportSource?: string | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('jsxImportSource')
      .toEqualTypeOf<Nilable<string>>()
  })

  it('should match [jsxSideEffects?: boolean | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('jsxSideEffects')
      .toEqualTypeOf<Nilable<boolean>>()
  })

  it('should match [keepNames?: boolean | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('keepNames')
      .toEqualTypeOf<Nilable<boolean>>()
  })

  it('should match [loader?: Partial<Record<EmptyString | Ext, Loader>> | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('loader')
      .toEqualTypeOf<Nilable<Partial<Record<EmptyString | Ext, Loader>>>>()
  })

  it('should match [logOverride?: Record<string, LogLevel> | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('logOverride')
      .toEqualTypeOf<Nilable<Record<string, LogLevel>>>()
  })

  it('should match [mangleCache?: Record<string, string | false> | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('mangleCache')
      .toEqualTypeOf<Nilable<Record<string, string | false>>>()
  })

  it('should match [mangleProps?: RegExp | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('mangleProps')
      .toEqualTypeOf<Nilable<RegExp>>()
  })

  it('should match [mangleQuoted?: boolean | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('mangleQuoted')
      .toEqualTypeOf<Nilable<boolean>>()
  })

  it('should match [minify?: boolean | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('minify')
      .toEqualTypeOf<Nilable<boolean>>()
  })

  it('should match [minifyIdentifiers?: boolean | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('minifyIdentifiers')
      .toEqualTypeOf<Nilable<boolean>>()
  })

  it('should match [minifySyntax?: boolean | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('minifySyntax')
      .toEqualTypeOf<Nilable<boolean>>()
  })

  it('should match [minifyWhitespace?: boolean | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('minifyWhitespace')
      .toEqualTypeOf<Nilable<boolean>>()
  })

  it('should match [platform?: Platform | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('platform')
      .toEqualTypeOf<Nilable<Platform>>()
  })

  it('should match [reserveProps?: RegExp | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('reserveProps')
      .toEqualTypeOf<Nilable<RegExp>>()
  })

  it('should match [supported?: Record<string, boolean> | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('supported')
      .toEqualTypeOf<Nilable<Record<string, boolean>>>()
  })

  it('should match [target?: Set<string> | string[] | string | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('target')
      .toEqualTypeOf<Nilable<Set<string> | string[] | string>>()
  })

  it('should match [tsconfigRaw?: Tsconfig | string | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('tsconfigRaw')
      .toEqualTypeOf<Nilable<Tsconfig | string>>()
  })
})
