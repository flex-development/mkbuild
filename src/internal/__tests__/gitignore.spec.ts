/**
 * @file Unit Tests - gitignore
 * @module mkbuild/internal/tests/unit/gitignore
 */

import pathe from '@flex-development/pathe'
import testSubject from '../gitignore'

describe('unit:internal/gitignore', () => {
  it('should return empty set if .gitignore file is not found', async () => {
    // Arrange
    const absWorkingDir: string = pathe.resolve('__fixtures__/pkg/buddy')

    // Act + Expect
    expect(await testSubject(absWorkingDir)).to.be.empty.instanceof(Set)
  })

  it('should return set containing .gitignore ignore patterns', async () => {
    // Act
    const result = await testSubject(process.cwd())

    // Expect
    expect(result).to.be.instanceof(Set).and.not.empty
    expect(result).toMatchSnapshot()
  })
})
