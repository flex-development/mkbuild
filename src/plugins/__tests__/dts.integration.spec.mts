/**
 * @file Integration Tests - dts
 * @module mkbuild/plugins/tests/integration/dts
 */

import testSubject from '#plugins/dts'
import createHasPlugin, { type HasPlugin } from '#tests/utils/create-has-plugin'
import runnableTask from '#utils/runnable-task'
import type { FileSystem, Result, Task } from '@flex-development/mkbuild'
import { constant, isObjectPlain, type Fn } from '@flex-development/tutils'
import { ok } from 'devlop'

describe('integration:plugins/dts', () => {
  let hasPlugin: HasPlugin

  beforeAll(() => {
    hasPlugin = createHasPlugin(testSubject.PLUGIN_NAME)
  })

  it.each<[
    Task,
    FileSystem | null | undefined,
    Fn<[Task, FileSystem | null | undefined], Fn<[Result], undefined>>?
  ]>([
    [
      {
        dts: 'only',
        input: 'src/*.mts',
        logLevel: 'silent',
        root: '__fixtures__/pkg/reverse',
        tsconfig: 'tsconfig.json'
      },
      null,
      function assertion(
        this: void,
        task: Task | null | undefined
      ): Fn<[Result], undefined> {
        ok(task, 'expected `task`')
        ok(task.dts === 'only', 'expected `task.dts`')

        /**
         * Expected `task.dts` value.
         *
         * @const {string} dts
         */
        const dts: string = task.dts

        /**
         * Regular expression matching expected output file extensions.
         *
         * @const {RegExp} ext
         */
        const ext: RegExp = /\.d\.mts$/

        return assert

        /**
         * @this {void}
         *
         * @param {Result} result
         *  Build result
         * @return {undefined}
         */
        function assert(this: void, result: Result): undefined {
          expect(result).to.have.property('messages').be.of.length(1)
          expect(result).to.have.nested.property('task.dts', dts)
          expect(result.outputs).to.have.property('length', 4)
          expect(result.outputs).to.each.have.property('fileName').match(ext)

          return void result
        }
      }
    ],
    [
      {
        dts: true,
        input: 'src/*.ts',
        logLevel: 'silent',
        root: '__fixtures__/pkg/tribonacci',
        tsconfig: 'tsconfig.json'
      },
      null,
      function assertion(
        this: void,
        task: Task | null | undefined
      ): Fn<[Result], undefined> {
        ok(task, 'expected `task`')
        ok(task.dts === true, 'expected `task.dts`')

        /**
         * Expected `task.dts` value.
         *
         * @const {boolean} dts
         */
        const dts: boolean = task.dts

        /**
         * Regular expression matching expected output file extensions.
         *
         * @const {RegExp} ext
         */
        const ext: RegExp = /\.(?:(?:d\.ts(?:\.map)?)|(?:mjs))$/

        return assert

        /**
         * @this {void}
         *
         * @param {Result} result
         *  Build result
         * @return {undefined}
         */
        function assert(this: void, result: Result): undefined {
          expect(result).to.have.property('messages').be.not.empty
          expect(result).to.have.nested.property('task.dts', dts)
          expect(result.outputs).to.have.property('length', 3)
          expect(result.outputs).to.each.have.property('fileName').match(ext)

          return void result
        }
      }
    ]
  ])('should generate declaration files (%#)', async (
    task,
    fs,
    assert = () => constant(undefined)
  ) => {
    // Act
    const result = await runnableTask(task, fs).run()

    // Expect
    expect(result).to.have.property('failure').be.null
    expect(result).to.have.property('task', task).satisfy(isObjectPlain)
    expect(result).to.have.nested.property('task.plugins').satisfy(hasPlugin)

    // Assert
    assert(task, fs)(result)
  }, 10000)
})
