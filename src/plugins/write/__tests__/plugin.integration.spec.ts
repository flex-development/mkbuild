/**
 * @file Integration Tests - write plugin
 * @module mkbuild/plugins/tests/integration/write
 */

import ESBUILD_OPTIONS from '#fixtures/options-esbuild'
import vfs from '#fixtures/volume'
import pathe from '@flex-development/pathe'
import * as esbuild from 'esbuild'
import testSubject from '../plugin'

vi.mock('#src/utils/fs')

describe('integration:plugins/write', () => {
  let options: esbuild.BuildOptions & { metafile: true; write: false }

  afterEach(() => {
    vfs.reset()
  })

  beforeAll(() => {
    options = {
      ...ESBUILD_OPTIONS,
      logLevel: 'silent',
      plugins: [testSubject()]
    }
  })

  describe('esbuild', () => {
    it('should write output files', async () => {
      // Arrange
      const absWorkingDir: string = pathe.resolve('__fixtures__/pkg/dbl-linear')
      const path: string = pathe.resolve(absWorkingDir, 'dist/dbl-linear.mjs')

      // Act
      await esbuild.build({
        ...options,
        absWorkingDir,
        entryPoints: ['dbl-linear.ts'],
        format: 'esm',
        loader: { '.mts': 'ts' },
        outExtension: { '.js': '.mjs' }
      })

      // Expect
      expect(vfs.toJSON()).to.have.property(path).be.a('string')
    })
  })
})
