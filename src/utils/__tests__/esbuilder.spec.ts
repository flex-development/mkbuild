/**
 * @file Unit Tests - esbuilder
 * @module mkbuild/utils/tests/unit/esbuilder
 */

import type { SourceFile } from '#src/interfaces'
import testSubject from '../esbuilder'

describe('unit:utils/esbuilder', () => {
  it('should return empty array if source should not be built', async () => {
    // Arrange
    const source: Pick<SourceFile, 'ext' | 'file'> = {
      ext: '.hbs',
      file: 'header.hbs'
    }

    // Act
    const results = await testSubject(source, {
      declaration: false,
      ext: '.mjs',
      format: 'esm',
      outdir: 'dist/esm',
      source: '__fixtures__'
    })

    // Expect
    expect(results).to.be.empty
  })
})
