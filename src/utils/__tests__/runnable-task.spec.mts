/**
 * @file Unit Tests - runnableTask
 * @module mkbuild/utils/tests/unit/runnableTask
 */

import IGNORE from '#utils/ignore-patterns'
import testSubject from '#utils/runnable-task'
import type { Result, Task } from '@flex-development/mkbuild'
import pathe from '@flex-development/pathe'
import { constant, isObjectPlain, type Fn } from '@flex-development/tutils'
import { ok } from 'devlop'

describe('unit:utils/runnableTask', () => {
  it('should return runnable build task', () => {
    // Act
    const result = testSubject(null)

    // Expect
    expect(result).to.have.property('run').be.a('function')
  })

  describe('#run', () => {
    it.each<[
      ...Parameters<typeof testSubject>,
      Fn<Parameters<typeof testSubject>, Fn<[Result], undefined>>?
    ]>([
      [
        {
          logLevel: 'silent'
        },
        null,
        function assertion(this: void): Fn<[Result], undefined> {
          return function assert(this: void, result: Result): undefined {
            expect(result).to.have.property('format', 'esm')
            expect(result).to.have.property('messages').of.length(0)
            expect(result).to.have.property('outdir', 'dist')
            expect(result).to.have.property('outputs').of.length(0)
            expect(result).to.have.property('root', pathe.cwd() + pathe.sep)
            expect(result).to.have.property('size', 0)
            expect(result).to.have.nested.property('task.dts', true)
            expect(result).to.have.nested.property('task.format', result.format)
            expect(result).to.have.nested.property('task.ignore').eql(IGNORE)
            expect(result).to.have.nested.property('task.logLevel', 'silent')
            expect(result).to.have.nested.property('task.outdir', result.outdir)
            expect(result).to.have.nested.property('task.root', result.root)
            expect(result).to.have.property('timings', null)

            return void result
          }
        }
      ],
      [
        {
          root: '__fixtures__/pkg/no-package-json'
        },
        null,
        function assertion(
          this: void,
          task: Task | null | undefined
        ): Fn<[Result], undefined> {
          ok(task, 'expected `task`')
          ok(typeof task.root === 'string', 'expected `task.root`')

          /**
           * Expected root.
           *
           * @const {string} root
           */
          const root: string = pathe.resolve(task.root) + pathe.sep

          return function assert(this: void, result: Result): undefined {
            expect(result).to.have.property('format', 'cjs')
            expect(result).to.have.property('messages').of.length(0)
            expect(result).to.have.property('outdir', 'dist')
            expect(result).to.have.property('outputs').of.length(0)
            expect(result).to.have.property('root', root)
            expect(result).to.have.property('size', 0)
            expect(result).to.have.nested.property('task.dts', false)
            expect(result).to.have.nested.property('task.format', result.format)
            expect(result).to.have.nested.property('task.ignore').eql(IGNORE)
            expect(result).to.have.nested.property('task.logLevel', 'info')
            expect(result).to.have.nested.property('task.outdir', result.outdir)
            expect(result).to.have.nested.property('task.root', result.root)
            expect(result).to.have.property('timings', null)

            return void result
          }
        }
      ],
      [
        {
          input: ['*'],
          logLevel: 'silent',
          resolve: {},
          root: '__fixtures__/pkg/browser-usage'
        },
        null,
        function assertion(
          this: void,
          task: Task | null | undefined
        ): Fn<[Result], undefined> {
          ok(task, 'expected `task`')
          ok(typeof task.root === 'string', 'expected `task.root`')

          /**
           * Expected root.
           *
           * @const {string} root
           */
          const root: string = pathe.resolve(task.root) + pathe.sep

          return function assert(this: void, result: Result): undefined {
            expect(result).to.have.property('format', 'cjs')
            expect(result).to.have.property('messages').of.length(0)
            expect(result).to.have.property('outputs').of.length(1)
            expect(result).to.have.property('root', root)
            expect(result).to.have.nested.property('task.dts', false)

            return void result
          }
        }
      ],
      [
        {
          experimental: { perf: true },
          gitignore: false,
          input: 'src/*.ts',
          logLevel: 'silent',
          root: '__fixtures__/pkg/tribonacci',
          sourcemap: true,
          tsconfig: 'tsconfig.json'
        },
        null,
        function assertion(this: void): Fn<[Result], undefined> {
          return function assert(this: void, result: Result): undefined {
            expect(result).to.have.property('format', 'esm')
            expect(result).to.have.property('messages').of.length(0)
            expect(result).to.have.property('outputs').of.length(2)
            expect(result).to.have.nested.property('task.dts', false)
            expect(result).to.have.property('timings').to.not.be.null

            return void result
          }
        }
      ]
    ])('should return build result (%#)', async (
      task,
      fs,
      assert = () => constant(undefined)
    ) => {
      // Act
      const runner = testSubject(task, fs)
      const result = await runner.run()

      // Expect
      expect(runner).to.satisfy(isObjectPlain).and.not.eq(task)
      expect(result).to.have.property('failure', null)
      expect(result).to.have.property('format').be.oneOf(['cjs', 'esm', 'iife'])
      expect(result).to.have.property('messages').be.an('array')
      expect(result).to.have.property('outdir').be.a('string')
      expect(result).to.have.property('outputs').be.an('array')
      expect(result).to.have.property('root').be.a('string')
      expect(result).to.have.property('size').be.a('number')
      expect(result).to.have.property('task').satisfy(isObjectPlain)
      expect(result).to.have.nested.property('task.plugins').be.an('array')
      expect(result).to.have.nested.property('task.plugins').to.not.be.empty
      expect(result).to.have.property('timings')

      // Expect (attach `bytes` to output assets and chunks)
      if (result.outputs.length) {
        expect(result.outputs).to.each.have.property('bytes').be.a('number')
      }

      // Expect (mutate `task`)
      task && expect(result).to.have.property('task', task)

      // Assert build result
      assert(task, fs)(result)
    })
  })
})
