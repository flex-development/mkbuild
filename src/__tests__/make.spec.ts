/**
 * @file Unit Tests - make
 * @module mkbuild/tests/make/unit
 */

import vfs from '#fixtures/volume'
import { IGNORE_PATTERNS as IGNORE } from '#src/config/constants'
import loadBuildConfig from '#src/config/load'
import type { Config, Result } from '#src/interfaces'
import analyzeResults from '#src/utils/analyze-results'
import esbuilder from '#src/utils/esbuilder'
import write from '#src/utils/write'
import type { Spy } from '#tests/interfaces'
import * as color from 'colorette'
import consola from 'consola'
import type { BuildFailure } from 'esbuild'
import fse from 'fs-extra'
import { globby } from 'globby'
import fs from 'node:fs'
import path from 'node:path'
import * as pathe from 'pathe'
import pkg from '../../package.json' assert { type: 'json' }
import testSubject from '../make'

vi.mock('fs-extra')
vi.mock('pathe')
vi.mock('../config/load')
vi.mock('../utils/analyze-results')
vi.mock('../utils/esbuilder')
vi.mock('../utils/write')

describe('unit:make', () => {
  const config: Config = { entries: [{}] }

  let filecount: number = 0

  beforeAll(async () => {
    for (let file of await globby('**', { cwd: 'src', ignore: IGNORE })) {
      file = path.resolve('src', file)
      vfs.mkdirpSync(path.dirname(file))
      vfs.writeFileSync(file, fs.readFileSync(file, 'utf8'))
      filecount++
    }

    vfs.writeFileSync('package.json', JSON.stringify(pkg))
    vfs.writeFileSync('tsconfig.json', fs.readFileSync('tsconfig.json'))

    consola.mockTypes(() => vi.fn())
  })

  afterAll(() => {
    vfs.reset()
  })

  describe('build', () => {
    let results: Result[]

    beforeEach(async () => {
      ;(loadBuildConfig as unknown as Spy).mockResolvedValueOnce(config)
      results = await testSubject()
    })

    it('should determine current working directory', () => {
      expect(pathe.resolve).toHaveBeenCalledWith(process.cwd(), '.')
    })

    it('should load package.json from current working directory', () => {
      expect(fse.readJson).toHaveBeenCalledOnce()
      expect(fse.readJson).toHaveBeenCalledWith(path.resolve('package.json'))
    })

    it('should print build start info', () => {
      // Arrange
      const message: string = `Building ${pkg.name}`

      // Expect
      expect(consola.info).toHaveBeenCalledWith(color.cyan(message))
    })

    it('should build source files', () => {
      expect(esbuilder).toHaveBeenCalledTimes(config.entries!.length)
    })

    it('should write build results', () => {
      expect(write).toHaveBeenCalledTimes(filecount)
    })

    it('should print build done info', () => {
      // Arrange
      const message: string = `Build succeeded for ${pkg.name}`

      // Expect
      expect(consola.success).toHaveBeenCalledWith(color.green(message))
    })

    it('should print build analysis', () => {
      expect(analyzeResults).toHaveBeenCalledTimes(config.entries!.length)
    })

    it('should print total build size', () => {
      // Arrange
      const bytes: string = expect.any(String)

      // Expect
      expect(consola.log).lastCalledWith('Σ Total build size:', bytes)
    })

    it('should return build results', () => {
      expect(results).to.be.an('array').that.is.not.empty
    })
  })

  describe('error handling', () => {
    it('should exit early if package.json is not found', async () => {
      // Arrange
      const pkgfile: string = path.resolve(process.cwd(), 'package.json')
      const err: string = `ENOENT: no such file or directory, open ${pkgfile}`

      // Act
      ;(fse.readJson as unknown as Spy).mockRejectedValueOnce(new Error(err))
      const results = await testSubject()

      // Expect
      expect(consola.error).toHaveBeenCalledOnce()
      expect(consola.error).toHaveBeenCalledWith('package.json not found')
      expect(consola.info).toHaveBeenCalledTimes(0)
      expect(results).to.be.an('array').that.is.empty
    })

    it('should exit early if error building source file', async () => {
      // Arrange
      const error: Error = new Error('build failure')
      const failure: BuildFailure = { ...error, errors: [], warnings: [] }

      // Act
      ;(esbuilder as unknown as Spy).mockRejectedValueOnce(failure)
      const results = await testSubject()

      // Expect
      expect(write).toHaveBeenCalledTimes(0)
      expect(consola.success).toHaveBeenCalledTimes(0)
      expect(results).to.be.an('array').that.is.empty
    })

    it('should exit early if error writing build result', async () => {
      // Arrange
      const error: Error = new Error('write error')

      // Act
      ;(loadBuildConfig as unknown as Spy).mockResolvedValueOnce(config)
      ;(write as unknown as Spy).mockRejectedValueOnce(error)
      const results = await testSubject()

      // Expect
      expect(consola.error).toBeCalledTimes(1)
      expect(consola.error).toHaveBeenCalledWith(error.message)
      expect(consola.success).toHaveBeenCalledTimes(0)
      expect(results).to.be.an('array').that.is.empty
    })
  })
})
