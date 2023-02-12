/**
 * @file Type Tests - Config
 * @module mkbuild/interfaces/tests/unit-d/Config
 */

import type { FileSystemAdapter } from '#src/types'
import type TestSubject from '../config'
import type Entry from '../entry'
import type Options from '../options'

describe('unit-d:interfaces/Config', () => {
  it('should extend Options', () => {
    expectTypeOf<TestSubject>().toMatchTypeOf<Options>()
  })

  it('should match [clean?: boolean]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('clean')
      .toEqualTypeOf<boolean | undefined>()
  })

  it('should match [entries?: Partial<Entry>[]]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('entries')
      .toEqualTypeOf<Partial<Entry>[] | undefined>()
  })

  it('should match [fs?: FileSystemAdapter]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('fs')
      .toEqualTypeOf<FileSystemAdapter | undefined>()
  })
})
