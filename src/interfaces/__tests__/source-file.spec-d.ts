/**
 * @file Type Tests - SourceFile
 * @module mkbuild/interfaces/tests/unit-d/SourceFile
 */

import type * as pathe from '@flex-development/pathe'
import type TestSubject from '../source-file'

describe('unit-d:interfaces/SourceFile', () => {
  it('should match [ext: pathe.Ext]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('ext').toEqualTypeOf<pathe.Ext>()
  })

  it('should match [file: string]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('file').toBeString()
  })

  it('should match [path: string]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('path').toBeString()
  })
})
