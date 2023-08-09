/**
 * @file Type Tests - WritePluginOptions
 * @module mkbuild/plugins/tests/unit-d/write/WritePluginOptions
 */

import type { FileSystemAdapter } from '#src/types'
import type { Optional } from '@flex-development/tutils'
import type TestSubject from '../options'

describe('unit-d:plugins/write/WritePluginOptions', () => {
  it('should match [filter?: Optional<RegExp>]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('filter')
      .toEqualTypeOf<Optional<RegExp>>()
  })

  it('should match [mkdir?: FileSystemAdapter["mkdir"]]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('mkdir')
      .toEqualTypeOf<Optional<FileSystemAdapter['mkdir']>>()
  })

  it('should match [writeFile?: FileSystemAdapter["writeFile"]]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('writeFile')
      .toEqualTypeOf<Optional<FileSystemAdapter['writeFile']>>()
  })
})
