/**
 * @file Unit Tests - gitignore
 * @module mkbuild/utils/tests/unit/gitignore
 */

import testSubject from '#utils/gitignore'
import pathe from '@flex-development/pathe'
import { constant } from '@flex-development/tutils'

describe('unit:utils/gitignore', () => {
  it('should return empty list if `.gitignore` file is not found', () => {
    // Act
    const result = testSubject(null, {
      statSync: constant({
        isDirectory: constant(false),
        isFile: constant(false)
      })
    })

    // Expect
    expect(result).to.be.instanceof(Set).and.have.property('size', 0)
  })

  it('should return list of ignore patterns', () => {
    // Arrange
    const dir: URL = pathe.pathToFileURL('__fixtures__/pkg/tribonacci')

    // Act
    const result = testSubject(dir)

    // Expect
    expect(result).to.be.instanceof(Set).and.have.property('size').gt(0)
    expect(result).toMatchSnapshot()
  })
})
