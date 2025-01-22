/**
 * @file Type Tests - RunnableTask
 * @module mkbuild/interfaces/tests/unit-d/RunnableTask
 */

import type TestSubject from '#interfaces/task-runnable'
import type { Format, Result, Task } from '@flex-development/mkbuild'
import type { EmptyArray } from '@flex-development/tutils'

describe('unit-d:interfaces/RunnableTask', () => {
  it('should extend Task', () => {
    expectTypeOf<TestSubject>().toMatchTypeOf<Task>()
  })

  it('should match [format: Format]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('format').toEqualTypeOf<Format>()
  })

  it('should match [root: string]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('root').toEqualTypeOf<string>()
  })

  describe('run', () => {
    type Subject = TestSubject['run']

    it('should match [this: void]', () => {
      expectTypeOf<Subject>().thisParameter.toEqualTypeOf<void>()
    })

    describe('parameters', () => {
      it('should be callable with []', () => {
        expectTypeOf<Subject>().parameters.toEqualTypeOf<EmptyArray>()
      })
    })

    describe('returns', () => {
      it('should return Promise<Result>', () => {
        expectTypeOf<Subject>().returns.toEqualTypeOf<Promise<Result>>()
      })
    })
  })
})
