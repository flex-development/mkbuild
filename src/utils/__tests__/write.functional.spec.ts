/**
 * @file Functional Tests - write
 * @module mkbuild/utils/tests/functional/write
 */

import fse from 'fs-extra'
import * as pathe from 'pathe'
import testSubject from '../write'

vi.mock('fs-extra')
vi.mock('pathe')

describe('functional:utils/write', () => {
  const path: string = faker.system.filePath()
  const text: string = "export const foo = 'baz'"
  const contents: Uint8Array = new Uint8Array(Buffer.from(text))

  beforeEach(async () => {
    await testSubject({ contents, path, text })
  })

  it('should create subdirectories in outdir', () => {
    expect(pathe.dirname).toHaveBeenCalledOnce()
    expect(pathe.dirname).toHaveBeenCalledWith(path)
    expect(fse.mkdirp).toHaveBeenCalledOnce()
    expect(fse.mkdirp).toHaveBeenCalledWith(pathe.dirname(path))
  })

  it('should write build result', () => {
    expect(fse.writeFile).toHaveBeenCalledOnce()
    expect(fse.writeFile).toHaveBeenCalledWith(path, text, 'utf8')
  })
})
