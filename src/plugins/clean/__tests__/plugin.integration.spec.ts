/**
 * @file Integration Tests - clean plugin
 * @module mkbuild/plugins/tests/integration/clean
 */

import ESBUILD_OPTIONS from '#fixtures/options-esbuild'
import fsa from '#src/utils/fs'
import pathe from '@flex-development/pathe'
import * as esbuild from 'esbuild'
import testSubject from '../plugin'

vi.mock('#src/utils/fs')

describe('integration:plugins/clean', () => {
  describe('esbuild', () => {
    it('should clean outdir', async () => {
      // Arrange
      const absWorkingDir: string = pathe.resolve('__fixtures__/pkg/dbl-linear')
      const outdir: string = 'dist'
      const path: string = pathe.resolve(absWorkingDir, outdir)

      // Act
      await esbuild.build({
        ...ESBUILD_OPTIONS,
        absWorkingDir,
        entryPoints: ['dbl-linear.ts'],
        format: 'esm',
        loader: { '.mts': 'ts' },
        logLevel: 'silent',
        outExtension: { '.js': '.mjs' },
        plugins: [testSubject(fsa)]
      })

      // Expect
      expect(fsa.unlink).toHaveBeenCalledOnce()
      expect(fsa.unlink).toHaveBeenCalledWith(path)
      expect(fsa.rm).toHaveBeenCalledOnce()
      expect(fsa.rm).toHaveBeenCalledWith(path, { recursive: true })
      expect(fsa.mkdir).toHaveBeenCalledOnce()
      expect(fsa.mkdir).toHaveBeenCalledWith(path, { recursive: true })
    })
  })
})
