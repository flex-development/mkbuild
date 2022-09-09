/**
 * @file Functional Tests - tsconfig-paths plugin
 * @module mkbuild/plugins/tsconfig-paths/tests/functional
 */

import createPluginAPI from '#tests/utils/create-plugin-api'
import type { BuildOptions, OnStartResult, Plugin, PluginBuild } from 'esbuild'
import { createMatchPath } from 'tsconfig-paths'
import { tsConfigLoader } from 'tsconfig-paths/lib/tsconfig-loader'
import { SpyInstance } from 'vitest'
import testSubject from '../plugin'

vi.mock('tsconfig-paths', async () => {
  type Actual = typeof import('tsconfig-paths')
  const path: string = 'tsconfig-paths'

  const { createMatchPath } = await vi.importActual<Actual>(path)

  return { createMatchPath: vi.fn(createMatchPath) }
})

vi.mock('tsconfig-paths/lib/tsconfig-loader', async () => {
  type Actual = typeof import('tsconfig-paths/lib/tsconfig-loader')
  const path: string = 'tsconfig-paths/lib/tsconfig-loader'

  const { tsConfigLoader } = await vi.importActual<Actual>(path)

  return { tsConfigLoader: vi.fn(tsConfigLoader) }
})

describe('functional:plugins/tsconfig-paths', () => {
  let subject: Plugin

  beforeEach(() => {
    subject = testSubject()
  })

  describe('.setup', () => {
    it('should do nothing if bundling', () => {
      // Arrange
      const initialOptions: BuildOptions = { bundle: true }
      const build: PluginBuild = createPluginAPI({ initialOptions })

      // Act
      void subject.setup(build)

      // Expect
      expect(tsConfigLoader).toHaveBeenCalledTimes(0)
      expect(build.onStart).toHaveBeenCalledTimes(0)
      expect(createMatchPath).toHaveBeenCalledTimes(0)
      expect(build.onEnd).toHaveBeenCalledTimes(0)
    })

    it('should send error message if tsconfig is not found', () => {
      // Arrange
      const onStart = vi.fn((): OnStartResult => {
        return {
          errors: [{ pluginName: subject.name, text: 'tsconfig not found' }]
        }
      })
      const build: PluginBuild = createPluginAPI({ onStart })

      // Act
      ;(tsConfigLoader as unknown as SpyInstance).mockReturnValueOnce({})
      void subject.setup(build)

      // Expect
      expect(tsConfigLoader).toHaveBeenCalledOnce()
      expect(onStart).toHaveBeenCalledOnce()
      expect(createMatchPath).toHaveBeenCalledTimes(0)
      expect(build.onEnd).toHaveBeenCalledTimes(0)
      expect(onStart.mock.results[0]!.value).toMatchSnapshot()
    })

    it('should resolve path aliases in output file content', () => {
      // Arrange
      const build: PluginBuild = createPluginAPI()

      // Act
      void subject.setup(build)

      // Expect
      expect(tsConfigLoader).toHaveBeenCalledOnce()
      expect(build.onStart).toHaveBeenCalledTimes(0)
      expect(createMatchPath).toHaveBeenCalledOnce()
      expect(build.onEnd).toHaveBeenCalledOnce()
    })
  })
})
