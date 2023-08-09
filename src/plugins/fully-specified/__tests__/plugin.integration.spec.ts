/**
 * @file Integration Tests - fully-specified plugin
 * @module mkbuild/plugins/tests/integration/fully-specified
 */

import ESBUILD_OPTIONS from '#fixtures/options-esbuild'
import {
  ERR_PACKAGE_IMPORT_NOT_DEFINED,
  type NodeError
} from '@flex-development/errnode'
import * as mlly from '@flex-development/mlly'
import { cast } from '@flex-development/tutils'
import * as esbuild from 'esbuild'
import testSubject from '../plugin'

vi.mock('@flex-development/mlly')

describe('integration:plugins/fully-specified', () => {
  let options: esbuild.BuildOptions & { metafile: true; write: false }

  beforeAll(() => {
    options = {
      ...ESBUILD_OPTIONS,
      entryPoints: ['src/cli/index.ts'],
      format: 'esm',
      logLevel: 'silent',
      outExtension: { '.js': '.mjs' },
      plugins: [testSubject()],
      sourcemap: true,
      sourcesContent: false
    }
  })

  describe('esbuild', () => {
    it('should fill specifiers in output files', async () => {
      // Act
      const { errors, outputFiles, warnings } = await esbuild.build(options)

      // Expect
      expect(errors).to.be.an('array').of.length(0)
      expect(warnings).to.be.an('array').of.length(0)
      expect(mlly.findStaticImports(outputFiles[1]?.text)).toMatchSnapshot()
    })

    it('should throw if error occurs', async () => {
      // Arrange
      const base: string = import.meta.url
      const error: NodeError = new ERR_PACKAGE_IMPORT_NOT_DEFINED('#app', base)
      let errors: esbuild.Message[] = []

      // Act
      try {
        vi.mocked(mlly.fillModules).mockRejectedValueOnce(error)
        await esbuild.build(options)
      } catch (e: unknown) {
        errors = cast<esbuild.BuildFailure>(e).errors
      }

      // Expect
      expect(errors).to.be.an('array').of.length(1)
      expect(errors[0]).to.have.property('id', error.code)
      expect(errors[0]).to.have.property('location', null)
      expect(errors[0]).to.have.property('notes').be.an('array').of.length(1)
      expect(errors[0]).to.have.property('pluginName', 'fully-specified')
      expect(errors[0]).to.have.property('text', error.message)
      expect(errors[0]!.notes[0]).to.have.property('location', null)
      expect(errors[0]!.notes[0]).to.have.property('text', error.stack)
    })
  })
})
