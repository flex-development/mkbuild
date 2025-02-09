/**
 * @file Integration Tests - esbuild
 * @module mkbuild/plugins/tests/integration/esbuild
 */

import testSubject from '#plugins/esbuild'
import createHasPlugin, { type HasPlugin } from '#tests/utils/create-has-plugin'
import runnableTask from '#utils/runnable-task'
import type { FileSystem, Result, Task } from '@flex-development/mkbuild'
import pathe from '@flex-development/pathe'
import { constant, isObjectPlain, type Fn } from '@flex-development/tutils'
import { ok } from 'devlop'
import { readFileSync } from 'node:fs'
import tsconfig from '../../../tsconfig.build.json' with { type: 'json' }

describe('integration:plugins/esbuild', () => {
  let hasPlugin: HasPlugin

  beforeAll(() => {
    hasPlugin = createHasPlugin(testSubject.PLUGIN_NAME)
  })

  it.each<[
    Task,
    (FileSystem | null | undefined)?,
    Fn<[Task, FileSystem | null | undefined], Fn<[Result], undefined>>?
  ]>([
    [
      {
        esbuild: { drop: Object.freeze([]), dropLabels: null, tsconfigRaw: {} },
        input: ['*'],
        logLevel: 'silent',
        root: '__fixtures__/pkg/browser-usage',
        sourcemap: true
      },
      null,
      function assertion(
        this: void,
        task: Task | null | undefined
      ): Fn<[Result], undefined> {
        ok(task, 'expected `task`')
        ok(typeof task.root === 'string', 'expected `task.root`')

        /**
         * Module id of file containing source code.
         *
         * @const {string} id
         */
        const id: string = pathe.resolve(task.root, 'browser-usage.json')

        /**
         * Source code.
         *
         * @const {string} code
         */
        const code: string = readFileSync(id, 'utf8')

        return assert

        /**
         * @this {void}
         *
         * @param {Result} result
         *  Build result
         * @return {undefined}
         */
        function assert(this: void, result: Result): undefined {
          expect(result).to.have.property('messages').of.length(0)
          expect(result).to.have.property('outputs').of.length(1)
          expect(result.outputs).to.each.have.property('code', code)
          expect(result.outputs).to.each.have.property('type', 'chunk')

          return void result
        }
      }
    ],
    [
      {
        dts: false,
        esbuild: {
          logOverride: {
            'unsupported-dynamic-import': 'warning'
          },
          pure: new Set(),
          target: ['node18', tsconfig.compilerOptions.target]
        },
        input: [
          '!src/internal/*.d.mts',
          'src/*.mts',
          'src/internal/*.mts',
          'src/plugins/*.mts',
          'src/utils/*.mts'
        ],
        logLevel: 'silent',
        resolve: {
          conditions: tsconfig.compilerOptions.customConditions
        }
      },
      null,
      function assertion(): Fn<[Result], undefined> {
        return assert

        /**
         * @this {void}
         *
         * @param {Result} result
         *  Build result
         * @return {undefined}
         */
        function assert(this: void, result: Result): undefined {
          expect(result).to.have.property('messages').of.length(1)
          expect(result).to.have.nested.property('outputs.length').gt(0)
          expect(result.outputs).to.each.have.property('code').be.a('string')
          expect(result.outputs).to.each.have.property('type', 'chunk')

          return void result
        }
      }
    ]
  ])('should transform files with esbuild (%#)', async (
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
  })
})
