/**
 * @file Unit Tests - make
 * @module mkbuild/tests/make/unit
 */

import { ErrorCode, type NodeError } from '@flex-development/errnode'
import pathe from '@flex-development/pathe'
import testSubject from '../make'

describe('unit:make', () => {
  it('should throw if package.json file is not found', async () => {
    // Arrange
    const base: string = pathe.resolve('src/make.ts')
    const cwd: string = '__fixtures__/pkg/no-package-json'
    const id: string = pathe.resolve(cwd, 'package.json')
    const message: string = `Cannot find module '${id}' imported from ${base}`
    let error!: NodeError

    // Act
    try {
      await testSubject({ configfile: false, cwd })
      assert.fail('expected exception not thrown')
    } catch (e: unknown) {
      error = e as typeof error
    }

    // Expect
    expect(error).to.have.property('code').equal(ErrorCode.ERR_MODULE_NOT_FOUND)
    expect(error).to.have.property('message').equal(message)
  })
})
