/**
 * @file Type Tests - FileSystemAdapter
 * @module mkbuild/types/tests/unit-d/FileSystemAdapter
 */

import type fs from 'node:fs'
import type fsp from 'node:fs/promises'
import type TestSubject from '../adapter-file-system'

describe('unit-d:types/FileSystemAdapter', () => {
  it('should match [lstat: (typeof fs)["lstat"]]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('lstat')
      .toEqualTypeOf<(typeof fs)['lstat']>()
  })

  it('should match [mkdir: (typeof fsp)["mkdir"]]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('mkdir')
      .toEqualTypeOf<(typeof fsp)['mkdir']>()
  })

  it('should match [readdir: (typeof fsp)["readdir"]]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('readdir')
      .toEqualTypeOf<(typeof fsp)['readdir']>()
  })

  it('should match [readdirSync: (typeof fs)["readdirSync"]]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('readdirSync')
      .toEqualTypeOf<(typeof fs)['readdirSync']>()
  })

  it('should match [rm: (typeof fsp)["rm"]]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('rm')
      .toEqualTypeOf<(typeof fsp)['rm']>()
  })

  it('should match [stat: (typeof fs)["stat"]]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('stat')
      .toEqualTypeOf<(typeof fs)['stat']>()
  })

  it('should match [unlink: (typeof fsp)["unlink"]]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('unlink')
      .toEqualTypeOf<(typeof fsp)['unlink']>()
  })

  it('should match [writeFile: (typeof fsp)["writeFile"]]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('writeFile')
      .toEqualTypeOf<(typeof fsp)['writeFile']>()
  })
})
