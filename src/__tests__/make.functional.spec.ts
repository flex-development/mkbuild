/**
 * @file Functional Tests - make
 * @module mkbuild/tests/make/functional
 */

import loadBuildConfig from '#src/config/load'
import type { Context } from '#src/interfaces'
import createContext from '#src/internal/create-context'
import analyzeOutputs from '#src/utils/analyze-outputs'
import getPackageJson from '#tests/utils/get-package-json'
import * as mlly from '@flex-development/mlly'
import pathe from '@flex-development/pathe'
import type { PackageJson } from '@flex-development/pkg-types'
import * as color from 'colorette'
import consola from 'consola'
import { asyncExitHook as exitHook } from 'exit-hook'
import testSubject from '../make'

vi.mock('@flex-development/mlly')
vi.mock('exit-hook')
vi.mock('../config/load')
vi.mock('../internal/create-context')
vi.mock('../plugins/clean/plugin')
vi.mock('../plugins/write/plugin')
vi.mock('../utils/analyze-outputs')

describe('functional:make', () => {
  beforeAll(() => {
    consola.mockTypes(() => vi.fn())
  })

  describe('build', () => {
    let cwd: string
    let pkgjson: PackageJson
    let pattern: string

    beforeAll(async () => {
      cwd = '__fixtures__/pkg/buddy'
      pattern = 'buddy.js'
      pkgjson = await getPackageJson(cwd + '/package.json')
    })

    beforeEach(async () => {
      await testSubject({ cwd, pattern, write: true })
    })

    it('should load build config', () => {
      expect(loadBuildConfig).toHaveBeenCalledOnce()
      expect(loadBuildConfig).toHaveBeenCalledWith(cwd)
    })

    it('should load package.json from current working directory', () => {
      expect(mlly.readPackageJson).toHaveBeenCalledOnce()
      expect(mlly.readPackageJson).toHaveBeenCalledWith(pathe.resolve(cwd))
    })

    it('should print build start info', () => {
      // Arrange
      const message: string = `Building ${pkgjson.name}`

      // Expect
      expect(consola.info).toHaveBeenCalledWith(color.cyan(message))
    })

    it('should create build context', () => {
      expect(createContext).toHaveBeenCalledTimes(2)
    })

    it('should print build done info', () => {
      // Arrange
      const message: string = `Build succeeded for ${pkgjson.name}`

      // Expect
      expect(consola.success).toHaveBeenCalledWith(color.green(message))
    })

    it('should print build output analysis', () => {
      expect(analyzeOutputs).toHaveBeenCalledTimes(2)
      expect(analyzeOutputs).toHaveBeenCalledWith('dist', expect.any(Array))
    })

    it('should print total build size', () => {
      // Arrange
      const bytes: string = expect.any(String)

      // Expect
      expect(consola.log).lastCalledWith('Σ Total build size:', bytes)
    })
  })

  describe('watch', () => {
    let context: Context
    let cwd: string
    let pkgjson: PackageJson

    beforeAll(async () => {
      context = {
        cancel: vi.fn(),
        dispose: vi.fn(),
        rebuild: vi.fn(),
        serve: vi.fn(),
        watch: vi.fn()
      }

      cwd = '__fixtures__/pkg/tribonacci'
      pkgjson = await getPackageJson(cwd + '/package.json')
    })

    beforeEach(async () => {
      vi.mocked(createContext).mockResolvedValue(context)
      await testSubject({ configfile: false, cwd, watch: true })
    })

    it('should load package.json from current working directory', () => {
      expect(mlly.readPackageJson).toHaveBeenCalledOnce()
      expect(mlly.readPackageJson).toHaveBeenCalledWith(pathe.resolve(cwd))
    })

    it('should print watch start info', () => {
      // Arrange
      const message: string = `Watching ${pkgjson.name}`

      // Expect
      expect(consola.info).toHaveBeenCalledWith(color.cyan(message))
    })

    it('should enable watch mode', () => {
      expect(context.watch).toHaveBeenCalledOnce()
    })

    it('should add hook to dispose build context on process exit', () => {
      expect(exitHook).toHaveBeenCalledOnce()
    })
  })
})
