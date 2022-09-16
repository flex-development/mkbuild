/**
 * @file Unit Tests - analyzeResults
 * @module mkbuild/utils/tests/unit/analyzeResults
 */

import type { Result } from '#src/interfaces'
import testSubject from '../analyze-results'

describe('unit:utils/analyzeResults', () => {
  it('should return pretty printed build results', () => {
    // Arrange
    const results: Pick<Result, 'bytes' | 'outfile'>[] = [
      { bytes: 30, outfile: 'dist/index.mjs' },
      { bytes: 86, outfile: 'dist/index.d.mts' },
      { bytes: 526, outfile: 'dist/config/constants.mjs' },
      { bytes: 901, outfile: 'dist/config/constants.d.mts' },
      { bytes: 0, outfile: 'dist/interfaces/entry.mjs' },
      { bytes: 872, outfile: 'dist/interfaces/entry.d.mts' },
      { bytes: 0, outfile: 'dist/interfaces/index.mjs' },
      { bytes: 342, outfile: 'dist/interfaces/index.d.mts' },
      { bytes: 0, outfile: 'dist/interfaces/options.mjs' },
      { bytes: 2292, outfile: 'dist/interfaces/options.d.mts' },
      { bytes: 0, outfile: 'dist/interfaces/result.mjs' },
      { bytes: 1206, outfile: 'dist/interfaces/result.d.mts' },
      { bytes: 0, outfile: 'dist/interfaces/source-file.mjs' },
      { bytes: 583, outfile: 'dist/interfaces/source-file.d.mts' },
      { bytes: 0, outfile: 'dist/interfaces/statement.mjs' },
      { bytes: 686, outfile: 'dist/interfaces/statement.d.mts' },
      { bytes: 575, outfile: 'dist/utils/analyze-results.mjs' },
      { bytes: 626, outfile: 'dist/utils/analyze-results.d.mts' },
      { bytes: 1048, outfile: 'dist/utils/extract-statements.mjs' },
      { bytes: 810, outfile: 'dist/utils/extract-statements.d.mts' },
      { bytes: 289, outfile: 'dist/utils/write.mjs' },
      { bytes: 619, outfile: 'dist/utils/write.d.mts' },
      { bytes: 2740, outfile: 'dist/plugins/dts/plugin.mjs' },
      { bytes: 265, outfile: 'dist/plugins/dts/plugin.d.mts' },
      { bytes: 0, outfile: 'dist/plugins/tsconfig-paths/options.mjs' },
      { bytes: 1037, outfile: 'dist/plugins/tsconfig-paths/options.d.mts' },
      { bytes: 2559, outfile: 'dist/plugins/tsconfig-paths/plugin.mjs' },
      { bytes: 507, outfile: 'dist/plugins/tsconfig-paths/plugin.d.mts' },
      { bytes: 0, outfile: 'dist/plugins/fully-specified/options.mjs' },
      { bytes: 367, outfile: 'dist/plugins/fully-specified/options.d.mts' },
      { bytes: 2274, outfile: 'dist/plugins/fully-specified/plugin.mjs' },
      { bytes: 878, outfile: 'dist/plugins/fully-specified/plugin.d.mts' }
    ]

    // Act + Expect
    expect(testSubject('dist', results)).toMatchSnapshot()
  })
})
