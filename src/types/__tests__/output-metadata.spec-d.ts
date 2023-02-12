/**
 * @file Type Tests - OutputMetadata
 * @module mkbuild/types/tests/unit-d/OutputMetadata
 */

import type * as esbuild from 'esbuild'
import type TestSubject from '../output-metadata'

describe('unit-d:types/OutputMetadata', () => {
  it('should equal type of esbuild.Metafile["outputs"][string]', () => {
    // Arrange
    type Expected = esbuild.Metafile['outputs'][string]

    // Expect
    expectTypeOf<TestSubject>().toEqualTypeOf<Expected>()
  })
})
