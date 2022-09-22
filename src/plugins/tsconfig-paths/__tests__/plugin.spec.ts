/**
 * @file Unit Tests - tsconfig-paths plugin
 * @module mkbuild/plugins/tsconfig-paths/tests/unit
 */

import type { Spy } from '#tests/interfaces'
import createPluginAPI from '#tests/utils/create-plugin-api'
import type { BuildOptions, Plugin, PluginBuild } from 'esbuild'
import { createMatchPath } from 'tsconfig-paths'
import { tsConfigLoader } from 'tsconfig-paths/lib/tsconfig-loader'
import testSubject from '../plugin'

vi.mock('tsconfig-paths')
vi.mock('tsconfig-paths/lib/tsconfig-loader')

describe('unit:plugins/tsconfig-paths', () => {
  let subject: Plugin

  beforeEach(() => {
    subject = testSubject()
  })

  it('should do nothing if bundling', async () => {
    // Arrange
    const bundle: BuildOptions['bundle'] = true
    const api: PluginBuild = createPluginAPI({ initialOptions: { bundle } })

    // Act
    await subject.setup(api)

    // Expect
    expect(tsConfigLoader).toHaveBeenCalledTimes(0)
    expect(createMatchPath).toHaveBeenCalledTimes(0)
    expect(api.onEnd).toHaveBeenCalledTimes(0)
  })

  it('should throw if metafile is not available', async () => {
    // Arrange
    const api: PluginBuild = createPluginAPI()
    let error: Error

    // Act
    try {
      await subject.setup(api)
    } catch (e: unknown) {
      error = e as Error
    }

    // Expect
    expect(error!).to.not.be.undefined
    expect(error!.message).to.equal('metafile required')
  })

  it('should throw if tsconfig is not found', async () => {
    // Arrange
    const metafile: BuildOptions['metafile'] = true
    const api: PluginBuild = createPluginAPI({ initialOptions: { metafile } })
    const loader = tsConfigLoader as unknown as Spy<typeof tsConfigLoader>
    let error: Error

    // Act
    try {
      loader.mockReturnValueOnce({ baseUrl: '', paths: {}, tsConfigPath: '' })
      await subject.setup(api)
    } catch (e: unknown) {
      error = e as Error
    }

    // Expect
    expect(error!).to.not.be.undefined
    expect(error!.message).to.equal('tsconfig not found')
  })
})
