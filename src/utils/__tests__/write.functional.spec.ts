/**
 * @file Functional Tests - write
 * @module mkbuild/utils/tests/functional/write
 */

import vfs from '#fixtures/volume'
import path from 'node:path'
import testSubject from '../write'

vi.mock('fs-extra')

describe('functional:utils/write', () => {
  const outfile: string = 'dist/foo/index.mjs'
  const text: string = "export const foo = 'baz'"

  beforeEach(async () => {
    await testSubject({
      contents: new Uint8Array(Buffer.from(text)),
      outfile,
      path: path.resolve(outfile),
      text
    })
  })

  afterEach(() => {
    vfs.reset()
  })

  it('should write build result to file system', () => {
    expect(vfs.toJSON()).to.have.property(path.resolve(outfile)).equal(text)
  })
})
