/**
 * @file Unit Tests - analyzeOutputs
 * @module mkbuild/utils/tests/unit/analyzeOutputs
 */

import type { OutputMetadata } from '#src/types'
import testSubject from '../analyze-outputs'

describe('unit:utils/analyzeOutputs', () => {
  it('should return build analysis object', () => {
    // Arrange
    const outputs: Record<string, Pick<OutputMetadata, 'bytes'>> = {
      'dist/index.d.mts': { bytes: 86 },
      'dist/index.mjs': { bytes: 30 },
      'dist/interfaces/entry.d.mts': { bytes: 342 },
      'dist/interfaces/entry.mjs': { bytes: 0 },
      'dist/interfaces/index.d.mts': { bytes: 342 },
      'dist/interfaces/index.mjs': { bytes: 0 },
      'dist/interfaces/result.d.mts': { bytes: 1206 },
      'dist/interfaces/result.mjs': { bytes: 0 },
      'dist/interfaces/source-file.d.mts': { bytes: 583 },
      'dist/interfaces/source-file.mjs': { bytes: 0 },
      'dist/interfaces/statement.d.mts': { bytes: 686 },
      'dist/interfaces/statement.mjs': { bytes: 0 },
      'dist/utils/analyze-outputs.d.mts': { bytes: 626 },
      'dist/utils/analyze-outputs.mjs': { bytes: 575 }
    }

    // Act
    const result = testSubject('dist', outputs)

    // Expect
    expect(result).to.have.property('bytes').be.a('number')
    expect(result.analysis).toMatchSnapshot()
  })
})
