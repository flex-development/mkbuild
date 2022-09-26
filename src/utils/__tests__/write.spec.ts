/**
 * @file Unit Tests - write
 * @module mkbuild/utils/tests/unit/write
 */

import vfs from '#fixtures/volume'
import type { OutputFile } from 'esbuild'
import fse from 'fs-extra'
import path from 'node:path'
import * as pathe from 'pathe'
import testSubject from '../write'

vi.mock('fs-extra')
vi.mock('pathe')

describe('unit:utils/write', () => {
  const outpath: string = path.resolve('dist/eight-ball/random-number.js')
  const text: string = 'export const RANDOM_NUMBER = Math.random() * 10'

  let result: OutputFile

  beforeEach(async () => {
    result = await testSubject({
      contents: new Uint8Array(Buffer.from(text)),
      path: outpath,
      text
    })
  })

  afterEach(() => {
    vfs.reset()
  })

  it('should create subdirectories in output directory', () => {
    expect(pathe.dirname).toHaveBeenCalledOnce()
    expect(pathe.dirname).toHaveBeenCalledWith(outpath)
    expect(fse.mkdirp).toHaveBeenCalledOnce()
    expect(fse.mkdirp).toHaveBeenCalledWith(path.dirname(outpath))
  })

  it('should write build result', () => {
    expect(fse.writeFile).toHaveBeenCalledOnce()
    expect(fse.writeFile).toHaveBeenCalledWith(outpath, text, 'utf8')
  })

  it('should return written build result', () => {
    expect(result).to.be.an('object')
    expect(result).to.have.property('contents').that.is.a('Uint8Array')
    expect(result).to.have.property('path').that.equals(outpath)
    expect(result).to.have.property('text').that.equals(text)
  })
})
