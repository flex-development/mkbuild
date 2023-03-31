/**
 * @file Type Tests - Flags
 * @module mkbuild/interfaces/tests/unit-d/Flags
 */

import type Config from '../config'
import type TestSubject from '../flags'

describe('unit-d:interfaces/Flags', () => {
  it('should match [clean?: Config["clean"]]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('clean')
      .toEqualTypeOf<Config['clean']>()
  })

  it('should match [dts?: Config["dts"]]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('dts')
      .toEqualTypeOf<Config['dts']>()
  })

  it('should match [ext?: Config["ext"]]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('ext')
      .toEqualTypeOf<Config['ext']>()
  })

  it('should match [format?: Config["format"]]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('format')
      .toEqualTypeOf<Config['format']>()
  })

  it('should match [name?: Config["name"]]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('name')
      .toEqualTypeOf<Config['name']>()
  })

  it('should match [outdir?: Config["outdir"]]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('outdir')
      .toEqualTypeOf<Config['outdir']>()
  })

  it('should match [pattern?: string | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('pattern')
      .toEqualTypeOf<string | undefined>()
  })

  it('should match [source?: Config["source"]]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('source')
      .toEqualTypeOf<Config['source']>()
  })

  it('should match [sourcemap?: Config["sourcemap"]]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('sourcemap')
      .toEqualTypeOf<Config['sourcemap']>()
  })

  it('should match [sourcesContent?: Config["sourcesContent"]]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('sourcesContent')
      .toEqualTypeOf<Config['sourcesContent']>()
  })

  it('should match [tsconfig?: Config["tsconfig"]]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('tsconfig')
      .toEqualTypeOf<Config['tsconfig']>()
  })

  it('should match [watch?: Config["watch"]]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('watch')
      .toEqualTypeOf<Config['watch']>()
  })
})
