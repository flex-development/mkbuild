/**
 * @file Integration Tests - tsconfig-paths plugin
 * @module mkbuild/plugins/tsconfig-paths/tests/integration
 */

import ESBUILD_OPTIONS from '#fixtures/esbuild-options'
import type { Spy } from '#tests/interfaces'
import {
  build,
  type BuildFailure,
  type BuildOptions,
  type Plugin
} from 'esbuild'
import Module from 'node:module'
import { createMatchPath } from 'tsconfig-paths'
import { tsConfigLoader } from 'tsconfig-paths/lib/tsconfig-loader'
import testSubject from '../plugin'

vi.mock('tsconfig-paths')
vi.mock('tsconfig-paths/lib/tsconfig-loader')

describe('integration:plugins/tsconfig-paths', () => {
  let options: BuildOptions
  let subject: Plugin

  beforeEach(() => {
    subject = testSubject()
    options = {
      ...ESBUILD_OPTIONS,
      entryPoints: ['__fixtures__/tsconfig-paths.ts'],
      format: 'esm',
      plugins: [subject]
    }
  })

  describe('esbuild', () => {
    it('should do nothing if bundling', async () => {
      // Act
      await build({
        ...options,
        bundle: true,
        external: Module.builtinModules.flatMap(m => [m, 'node:' + m])
      })

      // Expect
      expect(tsConfigLoader).toHaveBeenCalledTimes(0)
      expect(createMatchPath).toHaveBeenCalledTimes(0)
    })

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
      expect(tsConfigLoader).toHaveBeenCalledTimes(0)
      expect(createMatchPath).toHaveBeenCalledTimes(0)
      expect(failure!).to.have.keys(['errors', 'warnings'])
      expect(failure!.errors).toMatchSnapshot()
    })

    it('should send error message if tsconfig is not found', async () => {
      // Arrange
      const loader = tsConfigLoader as unknown as Spy<typeof tsConfigLoader>
      let failure: BuildFailure

      // Act
      loader.mockReturnValueOnce({ baseUrl: '', paths: {}, tsConfigPath: '' })
      try {
        await build(options)
      } catch (e: unknown) {
        failure = e as BuildFailure
      }

      // Expect
      expect(tsConfigLoader).toHaveBeenCalledTimes(1)
      expect(createMatchPath).toHaveBeenCalledTimes(0)
      expect(failure!).to.have.keys(['errors', 'warnings'])
      expect(failure!.errors).toMatchSnapshot()
    })

    it('should resolve path aliases', async () => {
      // Act
      const result = await build(options)

      // Expect
      expect(tsConfigLoader).toHaveBeenCalledTimes(1)
      expect(createMatchPath).toHaveBeenCalledTimes(1)
      expect(result.outputFiles![0]!.text).toMatchSnapshot()
    })
  })
})
