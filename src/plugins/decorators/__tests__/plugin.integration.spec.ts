/**
 * @file Integration Tests - decorators plugin
 * @module mkbuild/plugins/tests/integration/decorators
 */

import ESBUILD_OPTIONS from '#fixtures/options-esbuild'
import pathe from '@flex-development/pathe'
import * as esbuild from 'esbuild'
import testSubject from '../plugin'

describe('integration:plugins/decorators', () => {
  let options: esbuild.BuildOptions & { metafile: true; write: false }

  beforeAll(() => {
    options = {
      ...ESBUILD_OPTIONS,
      logLevel: 'silent',
      plugins: [testSubject()]
    }
  })

  describe('esbuild', () => {
    it('should skip modules that are not typescript', async () => {
      // Act
      const { errors, outputFiles, warnings } = await esbuild.build({
        ...options,
        absWorkingDir: pathe.resolve('__fixtures__/pkg/apple-stock'),
        entryPoints: ['apple-stock.jsonc'],
        loader: { '.jsonc': 'copy' }
      })

      // Expect
      expect(errors).to.be.an('array').of.length(0)
      expect(warnings).to.be.an('array').of.length(0)
      expect(outputFiles[0]?.text).toMatchSnapshot()
    })

    it('should skip typescript declaration modules', async () => {
      // Act
      const { errors, outputFiles, warnings } = await esbuild.build({
        ...options,
        entryPoints: ['typings/@faker-js/faker/global.d.ts'],
        loader: { '.d.ts': 'copy' }
      })

      // Expect
      expect(errors).to.be.an('array').of.length(0)
      expect(warnings).to.be.an('array').of.length(0)
      expect(outputFiles[0]?.text).toMatchSnapshot()
    })

    it('should skip typescript modules not using decorators', async () => {
      // Act
      const { errors, outputFiles, warnings } = await esbuild.build({
        ...options,
        absWorkingDir: pathe.resolve('__fixtures__/pkg/tribonacci'),
        entryPoints: ['src/tribonacci.ts'],
        format: 'esm',
        loader: { '.ts': 'ts' }
      })

      // Expect
      expect(errors).to.be.an('array').of.length(0)
      expect(warnings).to.be.an('array').of.length(0)
      expect(outputFiles[0]?.text).toMatchSnapshot()
    })

    it('should transpile typescript modules using decorators', async () => {
      // Act
      const { errors, outputFiles, warnings } = await esbuild.build({
        ...options,
        absWorkingDir: pathe.resolve('__fixtures__/pkg/post'),
        entryPoints: ['src/post.ts'],
        format: 'esm',
        loader: { '.ts': 'ts' },
        outExtension: { '.js': '.mjs' }
      })

      // Expect
      expect(errors).to.be.an('array').of.length(0)
      expect(warnings).to.be.an('array').of.length(0)
      expect(outputFiles[0]?.text).toMatchSnapshot()
    })
  })
})
