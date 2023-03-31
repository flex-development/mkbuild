/**
 * @file Unit Tests - createContext
 * @module mkbuild/internal/tests/unit/createContext
 */

import type { Task } from '#src'
import getPackageJson from '#tests/utils/get-package-json'
import type { PackageJson } from '@flex-development/pkg-types'
import testSubject from '../create-context'

vi.mock('#src/utils/fs')

describe('unit:internal/createContext', () => {
  let pkg: PackageJson

  beforeAll(async () => {
    pkg = await getPackageJson()
  })

  it('should return build context', async () => {
    // Arrange
    const task: Partial<Task> = {
      ignore: ['cli.ts'],
      tsconfig: 'tsconfig.build.json'
    }

    // Act
    const result = await testSubject(task, pkg)

    // Expect
    expect(result).to.have.property('cancel').be.instanceof(Function)
    expect(result).to.have.property('dispose').be.instanceof(Function)
    expect(result).to.have.property('rebuild').be.instanceof(Function)
    expect(result).to.have.property('serve').be.instanceof(Function)
    expect(result).to.have.property('watch').be.instanceof(Function)
  })
})
