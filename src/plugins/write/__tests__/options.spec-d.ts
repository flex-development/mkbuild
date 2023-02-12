/**
 * @file Type Tests - WritePluginOptions
 * @module mkbuild/plugins/tests/unit-d/write/WritePluginOptions
 */

import type { FileSystemAdapter } from '#src/types'
import type TestSubject from '../options'

describe('unit-d:plugins/WritePluginOptions', () => {
  it('should match [filter?: RegExp]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('filter')
      .toEqualTypeOf<RegExp | undefined>()
  })

  it('should match [mkdir?: FileSystemAdapter["mkdir"]]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('mkdir')
      .toEqualTypeOf<FileSystemAdapter['mkdir'] | undefined>()
  })

  it('should match [writeFile?: FileSystemAdapter["writeFile"]]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('writeFile')
      .toEqualTypeOf<FileSystemAdapter['writeFile'] | undefined>()
  })
})
