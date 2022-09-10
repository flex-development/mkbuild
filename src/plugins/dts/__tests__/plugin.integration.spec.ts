/**
 * @file Integration Tests - dts plugin
 * @module mkbuild/plugins/dts/tests/integration
 */

import ESBUILD_OPTIONS from '#fixtures/esbuild-options'
import {
  build,
  type BuildFailure,
  type BuildOptions,
  type Plugin
} from 'esbuild'
import path from 'node:path'
import { pick } from 'radash'
import testSubject from '../plugin'

describe('integration:plugins/dts', () => {
  let options: BuildOptions
  let subject: Plugin

  beforeEach(() => {
    subject = testSubject()
    options = {
      ...ESBUILD_OPTIONS,
      entryPoints: ['src/plugins/dts/plugin.ts'],
      plugins: [subject]
    }
  })

  describe('esbuild', () => {
    it('should send error message if metafile is not enabled', async () => {
      // Arrange
      let failure: BuildFailure

      // Act
      try {
        await build({ ...options, metafile: false })
      } catch (e: unknown) {
        failure = e as BuildFailure
      }

      // Expect
      expect(failure!).to.have.keys(['errors', 'warnings'])
      expect(failure!.errors).toMatchSnapshot()
    })

    it('should add .d.cts output to output files', async () => {
      // Act
      const { outputFiles = [] } = await build({
        ...options,
        format: 'cjs',
        outExtension: { '.js': '.cjs' }
      })
      outputFiles[1]!.path = path.basename(outputFiles[1]!.path)

      // Expect
      expect(outputFiles).to.be.an('array').of.length(2)
      expect(pick(outputFiles[1]!, ['path', 'text'])).toMatchSnapshot()
    })

    it('should add .d.mts output to output files', async () => {
      // Act
      const { outputFiles = [] } = await build({
        ...options,
        format: 'esm',
        outExtension: { '.js': '.mjs' }
      })
      outputFiles[1]!.path = path.basename(outputFiles[1]!.path)

      // Expect
      expect(outputFiles).to.be.an('array').of.length(2)
      expect(pick(outputFiles[1]!, ['path', 'text'])).toMatchSnapshot()
    })

    it('should add .d.ts output to output files', async () => {
      // Act
      const { outputFiles = [] } = await build(options)
      outputFiles[1]!.path = path.basename(outputFiles[1]!.path)

      // Expect
      expect(outputFiles).to.be.an('array').of.length(2)
      expect(pick(outputFiles[1]!, ['path', 'text'])).toMatchSnapshot()
    })
  })
})
