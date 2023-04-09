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
import type * as esbuild from 'esbuild'
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
  let context: Context
  let cwd: string
  let outfile: string
  let outputs: esbuild.Metafile['outputs']
  let pattern: string
  let pkgjson: PackageJson

  beforeAll(async () => {
    cwd = '__fixtures__/pkg/dbl-linear'
    outfile = 'dist/dbl-linear.mjs'
    pattern = 'dbl-linear.ts'
    pkgjson = await getPackageJson(cwd + '/package.json')

    outputs = {
      [outfile]: {
        bytes: 350,
        entryPoint: pattern,
        exports: [],
        imports: [],
        inputs: {}
      }
    }

    context = {
      cancel: vi.fn(),
      dispose: vi.fn(),
      rebuild: vi.fn(async () => ({
        errors: [],
        mangleCache: undefined,
        metafile: {
          inputs: { [pattern]: { bytes: 1501, format: 'esm', imports: [] } },
          outputs
        } as esbuild.Metafile,
        outputFiles: [
          {
            bytes: 350,
            contents: new Uint8Array(350),
            entryPoint: pattern,
            exports: ['default'],
            imports: [],
            outfile,
            path: pathe.resolve(cwd, outfile),
            text: ''
          }
        ],
        warnings: []
      })),
      serve: vi.fn(),
      watch: vi.fn()
    }

    consola.mockTypes(() => vi.fn())
  })

  beforeEach(() => {
    vi.mocked(createContext).mockResolvedValue(context)
  })

  describe('build', () => {
    beforeEach(async () => {
      await testSubject({ cwd, dts: false, pattern, write: true })
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
      expect(createContext).toHaveBeenCalledOnce()
    })

    it('should do static build', () => {
      expect(context.rebuild).toHaveBeenCalledOnce()
    })

    it('should print build done info', () => {
      // Arrange
      const message: string = `Build succeeded for ${pkgjson.name}`

      // Expect
      expect(consola.success).toHaveBeenCalledWith(color.green(message))
    })

    it('should print build output analysis', () => {
      expect(analyzeOutputs).toHaveBeenCalledTimes(1)
      expect(analyzeOutputs).toHaveBeenCalledWith('.', outputs)
    })

    it('should print total build size', () => {
      // Arrange
      const bytes: string = expect.any(String)

      // Expect
      expect(consola.log).lastCalledWith('Σ Total build size:', bytes)
    })
  })

  describe('serve', () => {
    beforeEach(async () => {
      await testSubject({ configfile: false, cwd, serve: true })
    })

    it('should load package.json from current working directory', () => {
      expect(mlly.readPackageJson).toHaveBeenCalledOnce()
      expect(mlly.readPackageJson).toHaveBeenCalledWith(pathe.resolve(cwd))
    })

    it('should print serve start info', () => {
      // Arrange
      const message: string = `Serving ${pkgjson.name}`

      // Expect
      expect(consola.info).toHaveBeenCalledWith(color.cyan(message))
    })

    it('should create build context', () => {
      expect(createContext).toHaveBeenCalledOnce()
    })

    it('should enable serve mode', () => {
      expect(context.serve).toHaveBeenCalledOnce()
      expect(context.serve).toHaveBeenCalledWith({})
    })

    it('should add hook to dispose build context on process exit', () => {
      expect(exitHook).toHaveBeenCalledOnce()
    })
  })

  describe('watch', () => {
    beforeEach(async () => {
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

    it('should create build context', () => {
      expect(createContext).toHaveBeenCalledOnce()
    })

    it('should enable watch mode', () => {
      expect(context.watch).toHaveBeenCalledOnce()
    })

    it('should add hook to dispose build context on process exit', () => {
      expect(exitHook).toHaveBeenCalledOnce()
    })
  })
})
