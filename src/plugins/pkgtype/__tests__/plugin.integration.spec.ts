/**
 * @file Integration Tests - pkgtype plugin
 * @module mkbuild/plugins/tests/integration/pkgtype
 */

import ESBUILD_OPTIONS from '#fixtures/options-esbuild'
import * as mlly from '@flex-development/mlly'
import pathe from '@flex-development/pathe'
import togglePkgType from '@flex-development/toggle-pkg-type'
import * as esbuild from 'esbuild'
import testSubject from '../plugin'

vi.mock('@flex-development/toggle-pkg-type')

describe('integration:plugins/pkgtype', () => {
  let absWorkingDir: string
  let options: esbuild.BuildOptions & { metafile: true; write: false }

  beforeAll(() => {
    absWorkingDir = pathe.resolve('__fixtures__/pkg/find-uniq')
    options = {
      ...ESBUILD_OPTIONS,
      absWorkingDir,
      logLevel: 'silent',
      plugins: [testSubject(mlly.readPackageJson(absWorkingDir)!)]
    }
  })

  describe('esbuild', () => {
    it('should toggle package type', async () => {
      // Act
      await esbuild.build({
        ...options,
        entryPoints: ['find-uniq.cts'],
        format: 'cjs',
        loader: { '.cts': 'ts' },
        outExtension: { '.js': '.cjs' }
      })

      // Expect
      expect(togglePkgType).toHaveBeenCalledTimes(2)
      expect(togglePkgType).toHaveBeenCalledWith(null, absWorkingDir)
    })
  })
})
