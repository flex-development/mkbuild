/**
 * @file Type Tests - Config
 * @module mkbuild/interfaces/tests/unit-d/Config
 */

import type TestSubject from '#interfaces/config'
import type { FileSystem, Task } from '@flex-development/mkbuild'
import type { Nilable } from '@flex-development/tutils'

describe('unit-d:interfaces/Config', () => {
  it('should extend Task', () => {
    expectTypeOf<TestSubject>().toMatchTypeOf<Task>()
  })

  it('should match [fs?: Partial<FileSystem> | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('fs')
      .toEqualTypeOf<Nilable<Partial<FileSystem>>>()
  })

  it('should match [tasks?: Task[] | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('tasks')
      .toEqualTypeOf<Nilable<Task[]>>()
  })
})
