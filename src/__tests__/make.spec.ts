/**
 * @file Unit Tests - make
 * @module mkbuild/tests/make/unit
 */

import { ErrorCode, type NodeError } from '@flex-development/errnode'
import pathe from '@flex-development/pathe'
import consola from 'consola'
import testSubject from '../make'

vi.mock('#src/utils/fs')

describe('unit:make', () => {
  beforeAll(() => {
    consola.mockTypes(() => vi.fn())
  })

  it('should return build results', async () => {
    // Act
    const results = await testSubject({ configfile: false })

    // Expect
    expect(results).to.be.an('array').that.is.not.empty
  })

  it('should throw if package.json file is not found', async () => {
    // Arrange
    const base: string = pathe.resolve('src/make.ts')
    const cwd: string = '__fixtures__/pkg/no-package-json'
    const id: string = pathe.resolve(cwd, 'package.json')
    const message: string = `Cannot find module '${id}' imported from ${base}`
    let error!: NodeError

    // Act
    try {
      await testSubject({ configfile: false, cwd, write: true })
      assert.fail('expected exception not thrown')
    } catch (e: unknown) {
      error = e as typeof error
    }

    // Expect
    expect(error).to.have.property('code').equal(ErrorCode.ERR_MODULE_NOT_FOUND)
    expect(error).to.have.property('message').equal(message)
  })
})
