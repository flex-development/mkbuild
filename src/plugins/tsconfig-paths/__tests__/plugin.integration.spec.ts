/**
 * @file Integration Tests - tsconfig-paths plugin
 * @module mkbuild/plugins/tsconfig-paths/tests/integration
 */

import ESBUILD_OPTIONS from '#fixtures/options-esbuild'
import type { Spy } from '#tests/interfaces'
import {
  ERR_INVALID_MODULE_SPECIFIER,
  type NodeError
} from '@flex-development/errnode'
import * as mlly from '@flex-development/mlly'
import pathe from '@flex-development/pathe'
import * as tscu from '@flex-development/tsconfig-utils'
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
      expect(errors).to.be.an('array').of.length(0)
      expect(warnings).to.be.an('array').of.length(0)
      expect(mlly.findStaticImports(outputFiles[1]?.text)).toMatchSnapshot()
    })

    it('should throw if error occurs', async () => {
      // Arrange
      const error: NodeError = new ERR_INVALID_MODULE_SPECIFIER('#src\\utils')
      let errors: esbuild.Message[] = []

      // Act
      try {
        ;(tscu.resolvePaths as unknown as Spy).mockRejectedValueOnce(error)
        await esbuild.build(options)
      } catch (e: unknown) {
        errors = (e as esbuild.BuildFailure).errors
      }

      // Expect
      expect(errors).to.be.an('array').of.length(1)
      expect(errors[0]).to.have.property('id').equal(error.code)
      expect(errors[0]).to.have.property('location').be.null
      expect(errors[0]).to.have.property('notes').be.an('array').of.length(1)
      expect(errors[0]).to.have.property('pluginName').equal('tsconfig-paths')
      expect(errors[0]).to.have.property('text').equal(error.message)
      expect(errors[0]!.notes[0]).to.have.property('location').be.null
      expect(errors[0]!.notes[0]).to.have.property('text').equal(error.stack)
    })
  })
})
