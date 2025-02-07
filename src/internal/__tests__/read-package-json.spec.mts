/**
 * @file Unit Tests - readPackageJson
 * @module mkbuild/internal/tests/unit/readPackageJson
 */

import testSubject from '#internal/read-package-json'
import pkg from '@flex-development/mkbuild/package.json'
import * as mlly from '@flex-development/mlly'
import pathe from '@flex-development/pathe'
import type { PackageJson } from '@flex-development/pkg-types'

vi.mock('@flex-development/mlly', async actual => {
  const m: typeof mlly = await actual<typeof mlly>()
  return { ...m, readPackageJson: vi.fn(m.readPackageJson) }
})

describe('unit:internal/readPackageJson', () => {
  let key: string
  let root: mlly.ModuleId

  afterEach(() => {
    testSubject.cache.clear()
  })

  beforeAll(() => {
    root = mlly.cwd()
    key = pathe.fileURLToPath(root)
  })

  it('should return `null` if `package.json` file is not found', () => {
    // Arrange
    const input: string = '__fixtures__/pkg/no-package-json' + pathe.sep

    // Act + Expect
    expect(testSubject(new URL(input, root))).to.be.null
  })

  it('should return cached package manifest object', () => {
    // Arrange
    testSubject.cache.set(key, pkg as PackageJson)

    // Act
    const result = testSubject(root)

    // Expect
    expect(result).to.eq(testSubject.cache.get(key))
    expect(mlly.readPackageJson).not.toHaveBeenCalled()
  })

  it('should return package manifest object', () => {
    expect(testSubject(root)).to.eql(pkg)
  })
})
