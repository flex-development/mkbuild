/**
 * @file Type Tests - CleanPluginOptions
 * @module mkbuild/plugins/tests/unit-d/clean/CleanPluginOptions
 */

import type { FileSystemAdapter } from '#src/types'
import type TestSubject from '../options'

describe('unit-d:plugins/CleanPluginOptions', () => {
  it('should match [mkdir?: FileSystemAdapter["mkdir"]]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('mkdir')
      .toEqualTypeOf<FileSystemAdapter['mkdir'] | undefined>()
  })

  it('should match [rm?: FileSystemAdapter["rm"]]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('rm')
      .toEqualTypeOf<FileSystemAdapter['rm'] | undefined>()
  })

  it('should match [unlink?: FileSystemAdapter["unlink"]]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('unlink')
      .toEqualTypeOf<FileSystemAdapter['unlink'] | undefined>()
  })
})
