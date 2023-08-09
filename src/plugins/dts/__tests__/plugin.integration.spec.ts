/**
 * @file Integration Tests - dts plugin
 * @module mkbuild/plugins/tests/integration/dts
 */

import ESBUILD_OPTIONS from '#fixtures/options-esbuild'
import pathe from '@flex-development/pathe'
import * as esbuild from 'esbuild'
import testSubject from '../plugin'

describe('integration:plugins/dts', () => {
  let options: esbuild.BuildOptions & { metafile: true; write: false }

  beforeAll(() => {
    options = {
      ...ESBUILD_OPTIONS,
      logLevel: 'silent',
      plugins: [testSubject()]
    }
  })

  describe('esbuild', () => {
    it('should add declaration output', async () => {
      // Arrange
      const absWorkingDir: string = pathe.resolve('__fixtures__/pkg/reverse')
      const dirname: string = pathe.join(absWorkingDir, 'dist')

      // Act
      const { errors, outputFiles, warnings } = await esbuild.build({
        ...options,
        absWorkingDir,
        entryPoints: ['src/reverse.mts'],
        format: 'esm',
        loader: { '.mts': 'ts' },
        outExtension: { '.js': '.mjs' },
        outbase: 'src'
      })

      // Expect
      expect(errors).to.be.an('array').that.is.empty
      expect(warnings).to.be.an('array').that.is.empty
      expect(outputFiles).to.be.an('array').of.length(2)
      expect(outputFiles).to.each.have.property('path').with.dirname(dirname)
      expect(outputFiles).to.containExactlyOne((output: esbuild.OutputFile) => {
        return output.path.endsWith('.d.mts')
      })
    })

    it('should add declaration output for copied file', async () => {
      // Arrange
      const absWorkingDir: string = pathe.resolve('__fixtures__/pkg/find-uniq')
      const dirname: string = pathe.join(absWorkingDir, 'dist')

      // Act
      const { errors, outputFiles, warnings } = await esbuild.build({
        ...options,
        absWorkingDir,
        entryPoints: ['find-uniq.cts'],
        format: 'cjs',
        loader: { '.cts': 'copy' },
        outExtension: { '.js': '.cjs' }
      })

      // Expect
      expect(errors).to.be.an('array').that.is.empty
      expect(warnings).to.be.an('array').that.is.empty
      expect(outputFiles).to.be.an('array').of.length(2)
      expect(outputFiles).to.each.have.property('path').with.dirname(dirname)
      expect(outputFiles).to.containExactlyOne((output: esbuild.OutputFile) => {
        return output.path.endsWith('.d.cts')
      })
    })

    it('should skip output files without entry points', async () => {
      // Act
      const { errors, outputFiles, warnings } = await esbuild.build({
        ...options,
        entryPoints: ['__fixtures__/pkg/apple-stock/apple-stock.jsonc'],
        loader: { '.jsonc': 'copy' }
      })

      // Expect
      expect(errors).to.be.an('array').that.is.empty
      expect(warnings).to.be.an('array').that.is.empty
      expect(outputFiles).to.be.an('array').of.length(1)
    })
  })
})
