/**
 * @file Integration Tests - filter plugin
 * @module mkbuild/plugins/tests/integration/filter
 */

import ESBUILD_OPTIONS from '#fixtures/options-esbuild'
import pathe from '@flex-development/pathe'
import * as esbuild from 'esbuild'
import testSubject from '../plugin'

describe('integration:plugins/filter', () => {
  describe('esbuild', () => {
    it('should filter output files', async () => {
      // Arrange
      const filter: RegExp = /\.mjs$/

      // Act
      const { metafile, outputFiles } = await esbuild.build({
        ...ESBUILD_OPTIONS,
        absWorkingDir: pathe.resolve('__fixtures__/pkg/dbl-linear'),
        entryPoints: ['dbl-linear.ts'],
        format: 'esm',
        loader: { '.mts': 'ts' },
        logLevel: 'silent',
        outExtension: { '.js': '.mjs' },
        plugins: [testSubject(filter)],
        sourcemap: true,
        sourcesContent: false
      })

      // Expect
      expect(Object.keys(metafile.outputs)).to.each.match(filter)
      expect(outputFiles).to.each.have.property('path').match(filter)
    })
  })
})
