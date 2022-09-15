/**
 * @file Functional Tests - make
 * @module mkbuild/tests/make/functional
 */

import vfs from '#fixtures/volume'
import loadBuildConfig from '#src/config/load'
import type { Config, Result } from '#src/interfaces'
import analyzeResults from '#src/utils/analyze-results'
import esbuilder from '#src/utils/esbuilder'
import write from '#src/utils/write'
import type { Spy } from '#tests/interfaces'
import * as color from 'colorette'
import consola from 'consola'
import fse from 'fs-extra'
import { globby } from 'globby'
import fs from 'node:fs/promises'
import path from 'node:path'
import * as pathe from 'pathe'
import type { PackageJson } from 'pkg-types'
import testSubject from '../make'

vi.mock('fs-extra')
vi.mock('pathe')
vi.mock('../config/load')
vi.mock('../utils/analyze-results')
vi.mock('../utils/esbuilder')
vi.mock('../utils/write')

describe('functional:make', () => {
  const pattern: Config['pattern'] = '*'
  const pkg: PackageJson = { name: 'test' }
  const source: string = '__fixtures__'
  const sourcefiles: string[] = []
  const entries: Config['entries'] = [
    { source },
    { declaration: false, ext: '.cjs', format: 'cjs' },
    { format: 'iife' }
  ]

  let results: Result[]

  beforeAll(async () => {
    const dir: string = path.resolve(source)

    for (const file of await globby(pattern, { cwd: dir })) {
      const content: string = await fs.readFile(path.resolve(dir, file), 'utf8')
      const sourcefile: string = path.resolve(dir, file)

      vfs.mkdirpSync(path.dirname(sourcefile))
      vfs.writeFileSync(sourcefile, content)

      sourcefiles.push(file)
    }

    vfs.writeFileSync('package.json', JSON.stringify(pkg))
  })

  beforeEach(async () => {
    ;(loadBuildConfig as unknown as Spy).mockResolvedValue({ entries, pattern })
    consola.mockTypes(() => vi.fn())
    results = await testSubject()
  })

  afterAll(() => {
    vfs.reset()
  })

  it('should determine current working directory', () => {
    expect(pathe.resolve).toHaveBeenCalledWith(process.cwd(), '.')
  })

  it('should load build config from current working directory', () => {
    expect(loadBuildConfig).toHaveBeenCalledTimes(1)
    expect(loadBuildConfig).toHaveBeenCalledWith(process.cwd())
  })

  it('should load package.json from current working directory', () => {
    expect(fse.readJson).toHaveBeenCalledTimes(1)
    expect(fse.readJson).toHaveBeenCalledWith(path.resolve('package.json'))
  })

  it('should print build start info', () => {
    // Arrange
    const message: string = `Building ${pkg.name}`

    // Expect
    expect(consola.info).toHaveBeenCalledWith(color.cyan(message))
  })

  it('should clean output directories', () => {
    expect(pathe.resolve).toHaveBeenCalledWith(process.cwd(), 'dist')
    expect(fse.unlink).toHaveBeenCalledTimes(1)
    expect(fse.emptyDir).toHaveBeenCalledTimes(1)
    expect(fse.mkdirp).toHaveBeenNthCalledWith(1, path.resolve('dist'))
  })

  it('should build source files', () => {
    expect(esbuilder).toHaveBeenCalledTimes(sourcefiles.length)
  })

  it('should write build results', () => {
    expect(write).toHaveBeenCalledTimes(sourcefiles.length)
  })

  it('should print build done info', () => {
    // Arrange
    const message: string = `Build succeeded for ${pkg.name}`

    // Expect
    expect(consola.success).toHaveBeenCalledWith(color.green(message))
  })

  it('should print build analysis', () => {
    expect(analyzeResults).toHaveBeenCalledTimes(entries.length)
    expect(consola.log).toHaveBeenCalledWith(analyzeResults('dist', results))
  })

  it('should print total build size', () => {
    expect(consola.log).lastCalledWith('Σ Total build size:', color.cyan('0 B'))
  })
})
