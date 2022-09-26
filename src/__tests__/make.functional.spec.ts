/**
 * @file Functional Tests - make
 * @module mkbuild/tests/make/functional
 */

import vfs from '#fixtures/volume'
import { IGNORE_PATTERNS as IGNORE } from '#src/config/constants'
import loadBuildConfig from '#src/config/load'
import type { Config } from '#src/interfaces'
import type { Spy } from '#tests/interfaces'
import consola from 'consola'
import fse from 'fs-extra'
import { globby } from 'globby'
import fs from 'node:fs'
import path from 'node:path'
import * as pathe from 'pathe'
import testSubject from '../make'

vi.mock('fs-extra')
vi.mock('pathe')
vi.mock('../config/load')

describe('functional:make', () => {
  beforeAll(() => {
    consola.mockTypes(() => vi.fn())
  })

  beforeEach(async () => {
    for (let file of await globby('**', { cwd: 'src', ignore: IGNORE })) {
      file = path.resolve('src', file)
      vfs.mkdirpSync(path.dirname(file))
      vfs.writeFileSync(file, fs.readFileSync(file, 'utf8'))
    }

    vfs.writeFileSync('package.json', fs.readFileSync('package.json'))
    vfs.writeFileSync('tsconfig.json', fs.readFileSync('tsconfig.json'))
  })

  afterEach(() => {
    vfs.reset()
  })

  it('should load build config', async () => {
    // Arrange
    const config: Config = { entries: [] }

    // Act
    ;(loadBuildConfig as unknown as Spy).mockResolvedValueOnce(config)
    await testSubject()

    // Expect
    expect(loadBuildConfig).toHaveBeenCalledTimes(1)
    expect(loadBuildConfig).toHaveBeenCalledWith('.')
  })

  it('should clean output directories', async () => {
    // Arrange
    const config: Config = { clean: true, entries: [{ format: 'cjs' }] }

    // Act
    ;(loadBuildConfig as unknown as Spy).mockResolvedValueOnce(config)
    await testSubject()

    // Expect
    expect(pathe.resolve).toHaveBeenCalledWith(process.cwd(), 'dist')
    expect(fse.unlink).toHaveBeenCalledTimes(1)
    expect(fse.emptyDir).toHaveBeenCalledTimes(1)
    expect(fse.mkdirp).toHaveBeenNthCalledWith(1, path.resolve('dist'))
  })

  it('should write all build results', async () => {
    // Arrange
    const config: Config = { entries: [{ bundle: true, minify: true }] }

    // Act
    ;(loadBuildConfig as unknown as Spy).mockResolvedValueOnce(config)
    await testSubject()

    // Expect
    expect(vfs.toJSON()[path.resolve('dist/index.mjs')]).to.not.be.null
  })

  it('should write dts build results only', async () => {
    // Arrange
    const config: Config = { entries: [{ declaration: 'only', ext: '.js' }] }

    // Act
    ;(loadBuildConfig as unknown as Spy).mockResolvedValueOnce(config)
    await testSubject()

    // Expect
    expect(Object.keys(vfs.toJSON())).to.each.satisfy((p: string): boolean => {
      return /\/dist\//.test(p) ? p.endsWith('.d.ts') : true
    })
  })
})
