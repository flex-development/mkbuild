/**
 * @file Unit Tests - make
 * @module mkbuild/tests/make/unit
 */

import type { Spy } from '#tests/interfaces'
import { ERR_MODULE_NOT_FOUND, type NodeError } from '@flex-development/errnode'
import * as mlly from '@flex-development/mlly'
import consola from 'consola'
import testSubject from '../make'

vi.mock('#src/utils/fs')
vi.mock('@flex-development/mlly')

describe('unit:make', () => {
  beforeAll(() => {
    consola.mockTypes(() => vi.fn())
  })

  it('should return build results', async () => {
    // Arrange
    const id: string = 'typescript'
    const error: NodeError = new ERR_MODULE_NOT_FOUND(id, import.meta.url)
    ;(mlly.resolveModule as unknown as Spy).mockRejectedValueOnce(error)

    // Act
    const result = await testSubject({ cwd: '__fixtures__/pkg/buddy' })

    // Expect
    expect(result).to.be.an('array').that.is.not.empty
  })
})
