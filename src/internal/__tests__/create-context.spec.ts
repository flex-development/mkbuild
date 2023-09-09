/**
 * @file Unit Tests - createContext
 * @module mkbuild/internal/tests/unit/createContext
 */

import pkg from '#pkg' assert { type: 'json' }
import type { Task } from '#src'
import { cast } from '@flex-development/tutils'
import testSubject from '../create-context'

vi.mock('#src/utils/fs')

describe('unit:internal/createContext', () => {
  it('should return build context', async () => {
    // Arrange
    const task: Partial<Task> = {
      ignore: ['cli/**'],
      sourcemap: true,
      sourcesContent: false,
      target: 'node16.20.0',
      tsconfig: 'tsconfig.build.json'
    }

    // Act
    const result = await testSubject(task, cast(pkg))

    // Expect
    expect(result).to.have.property('cancel').be.instanceof(Function)
    expect(result).to.have.property('dispose').be.instanceof(Function)
    expect(result).to.have.property('rebuild').be.instanceof(Function)
    expect(result).to.have.property('serve').be.instanceof(Function)
    expect(result).to.have.property('watch').be.instanceof(Function)
  })
})
