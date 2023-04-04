/**
 * @file Unit Tests - make
 * @module mkbuild/tests/make/unit
 */

import { ErrorCode, type NodeError } from '@flex-development/errnode'
import pathe from '@flex-development/pathe'
import testSubject from '../make'

vi.mock('../plugins/clean/plugin')

describe('unit:make', () => {
  let configfile: boolean

  beforeAll(() => {
    configfile = false
  })

  it('should return build results', async () => {
    // Act
    const results = await testSubject({
      configfile,
      ignore: ['cli/**'],
      tsconfig: 'tsconfig.build.json'
    })

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
      await testSubject({ configfile, cwd })
      assert.fail('expected exception not thrown')
    } catch (e: unknown) {
      error = e as typeof error
    }

    // Expect
    expect(error).to.have.property('code').equal(ErrorCode.ERR_MODULE_NOT_FOUND)
    expect(error).to.have.property('message').equal(message)
  })
})
