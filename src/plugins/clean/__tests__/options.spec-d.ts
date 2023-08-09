/**
 * @file Type Tests - CleanPluginOptions
 * @module mkbuild/plugins/tests/unit-d/clean/CleanPluginOptions
 */

import type { FileSystemAdapter } from '#src/types'
import type { Optional } from '@flex-development/tutils'
import type TestSubject from '../options'

describe('unit-d:plugins/clean/CleanPluginOptions', () => {
  it('should match [mkdir?: FileSystemAdapter["mkdir"]]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('mkdir')
      .toEqualTypeOf<Optional<FileSystemAdapter['mkdir']>>()
  })

  it('should match [rm?: FileSystemAdapter["rm"]]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('rm')
      .toEqualTypeOf<Optional<FileSystemAdapter['rm']>>()
  })

  it('should match [unlink?: FileSystemAdapter["unlink"]]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('unlink')
      .toEqualTypeOf<Optional<FileSystemAdapter['unlink']>>()
  })
})
