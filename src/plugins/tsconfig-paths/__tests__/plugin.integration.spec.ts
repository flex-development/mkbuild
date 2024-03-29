/**
 * @file Integration Tests - tsconfig-paths plugin
 * @module mkbuild/plugins/tests/integration/tsconfig-paths
 */

import ESBUILD_OPTIONS from '#fixtures/options-esbuild'
import {
  ERR_INVALID_MODULE_SPECIFIER,
  type NodeError
} from '@flex-development/errnode'
import * as mlly from '@flex-development/mlly'
import pathe from '@flex-development/pathe'
import * as tscu from '@flex-development/tsconfig-utils'
import { cast } from '@flex-development/tutils'
import * as esbuild from 'esbuild'
import testSubject from '../plugin'

vi.mock('@flex-development/tsconfig-utils')

describe('integration:plugins/tsconfig-paths', () => {
  let options: esbuild.BuildOptions & { metafile: true; write: false }

  beforeAll(() => {
    options = {
      ...ESBUILD_OPTIONS,
      absWorkingDir: pathe.resolve('__fixtures__/pkg/reverse'),
      entryPoints: ['src/reverse.mts'],
      format: 'esm',
      loader: { '.mts': 'ts' },
      logLevel: 'silent',
      outExtension: { '.js': '.mjs' },
      plugins: [testSubject()],
      sourcemap: true,
      sourcesContent: false
    }
  })

  describe('esbuild', () => {
    it('should resolve path aliases in output files', async () => {
      // Act
      const { errors, outputFiles, warnings } = await esbuild.build(options)

      // Expect
      expect(errors).to.be.an('array').that.is.empty
      expect(warnings).to.be.an('array').that.is.empty
      expect(mlly.findStaticImports(outputFiles[1]?.text)).toMatchSnapshot()
    })

    it('should throw if error occurs', async () => {
      // Arrange
      const error: NodeError = new ERR_INVALID_MODULE_SPECIFIER('#src\\utils')
      let errors: esbuild.Message[] = []

      // Act
      try {
        vi.mocked(tscu.resolvePaths).mockRejectedValueOnce(error)
        await esbuild.build(options)
      } catch (e: unknown) {
        errors = cast<esbuild.BuildFailure>(e).errors
      }

      // Expect
      expect(errors).to.be.an('array').of.length(1)
      expect(errors[0]).to.have.property('id', error.code)
      expect(errors[0]).to.have.property('location', null)
      expect(errors[0]).to.have.property('notes').be.an('array').of.length(1)
      expect(errors[0]).to.have.property('pluginName').equal('tsconfig-paths')
      expect(errors[0]).to.have.property('text', error.message)
      expect(errors[0]!.notes[0]).to.have.property('location', null)
      expect(errors[0]!.notes[0]).to.have.property('text', error.stack)
    })
  })
})
