/**
 * @file Type Tests - Config
 * @module mkbuild/interfaces/tests/unit-d/Config
 */

import type { FileSystemAdapter } from '#src/types'
import type { Omit, Optional } from '@flex-development/tutils'
import type * as esbuild from 'esbuild'
import type TestSubject from '../config'
import type Options from '../options'
import type Task from '../task'

describe('unit-d:interfaces/Config', () => {
  it('should extend Options', () => {
    expectTypeOf<TestSubject>().toMatchTypeOf<Options>()
  })

  it('should match [configfile?: boolean]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('configfile')
      .toEqualTypeOf<Optional<boolean>>()
  })

  it('should match [entries?: Partial<Omit<Task, "write">>[]]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('entries')
      .toEqualTypeOf<Optional<Partial<Omit<Task, 'write'>>[]>>()
  })

  it('should match [fs?: FileSystemAdapter]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('fs')
      .toEqualTypeOf<Optional<FileSystemAdapter>>()
  })

  it('should match [serve?: esbuild.ServeOptions | boolean]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('serve')
      .toEqualTypeOf<Optional<esbuild.ServeOptions | boolean>>()
  })

  it('should match [watch?: boolean]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('watch')
      .toEqualTypeOf<Optional<boolean>>()
  })

  it('should match [write?: boolean]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('write')
      .toEqualTypeOf<Optional<boolean>>()
  })
})
