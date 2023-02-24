/**
 * @file Functional Tests - make
 * @module mkbuild/tests/make/functional
 */

import loadBuildConfig from '#src/config/load'
import esbuilder from '#src/internal/esbuilder'
import analyzeResults from '#src/utils/analyze-results'
import fs from '#src/utils/fs'
import getPackageJson from '#tests/utils/get-package-json'
import * as mlly from '@flex-development/mlly'
import pathe from '@flex-development/pathe'
import type { PackageJson } from '@flex-development/pkg-types'
import * as color from 'colorette'
import consola from 'consola'
import testSubject from '../make'

vi.mock('#src/config/load')
vi.mock('#src/internal/esbuilder')
vi.mock('#src/plugins/write/plugin')
vi.mock('#src/utils/analyze-results')
vi.mock('#src/utils/fs')
vi.mock('@flex-development/mlly')

describe('functional:make', () => {
  let cwd: string
  let pkgjson: PackageJson

  beforeAll(async () => {
    consola.mockTypes(() => vi.fn())
    cwd = '__fixtures__/pkg/reverse'
    pkgjson = await getPackageJson(cwd + '/package.json')
  })

  beforeEach(async () => {
    await testSubject({ cwd, write: true })
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

  it('should clean output directories', () => {
    expect(fs.unlink).toHaveBeenCalledOnce()
    expect(fs.rm).toHaveBeenCalledOnce()
    expect(fs.mkdir).toHaveBeenCalledOnce()
  })

  it('should build source files', () => {
    expect(esbuilder).toHaveBeenCalledOnce()
  })

  it('should print build done info', () => {
    // Arrange
    const message: string = `Build succeeded for ${pkgjson.name}`

    // Expect
    expect(consola.success).toHaveBeenCalledWith(color.green(message))
  })

  it('should print build analysis', () => {
    expect(analyzeResults).toHaveBeenCalledOnce()
  })

  it('should print total build size', () => {
    // Arrange
    const bytes: string = expect.any(String)

    // Expect
    expect(consola.log).lastCalledWith('Σ Total build size:', bytes)
  })
})
