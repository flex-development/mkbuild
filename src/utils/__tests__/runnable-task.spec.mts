/**
 * @file Unit Tests - runnableTask
 * @module mkbuild/utils/tests/unit/runnableTask
 */

import IGNORE from '#utils/ignore-patterns'
import testSubject from '#utils/runnable-task'
import type {
  FileSystem,
  Format,
  Result,
  Task
} from '@flex-development/mkbuild'
import pathe from '@flex-development/pathe'
import {
  constant,
  isObjectPlain,
  type Fn,
  type Nilable
} from '@flex-development/tutils'
import { ok } from 'devlop'

describe('unit:utils/runnableTask', () => {
  it('should return runnable build task', () => {
    // Act
    const result = testSubject(null)

    // Expect
    expect(result).to.have.property('run').be.a('function')
  })

  describe('#run', () => {
    type Assert = Fn<Params, Fn<[Result], undefined>>
    type Params = [task: Task, fs?: Nilable<Partial<FileSystem>>]

    let formats: readonly Format[]

    beforeAll(() => {
      formats = Object.freeze(['cjs', 'esm', 'iife'])
    })

    describe('bundle', () => {
      it.each<[...Params, Assert?]>([
        [
          {
            bundle: true,
            entryFileNames: 'reverse{extname}',
            input: 'src/index.mts',
            logLevel: 'silent',
            moduleContext: null,
            resolve: { external: [] },
            root: '__fixtures__/pkg/reverse',
            tsconfig: 'tsconfig.json'
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

            return assert

            /**
             * @this {void}
             *
             * @param {Result} result
             *  Build result
             * @return {undefined}
             */
            function assert(this: void, result: Result): undefined {
              /**
               * Expected size.
               *
               * @const {number} size
               */
              const size: number = result.outputs[0]!.bytes

              expect(result).to.have.property('outputs').of.length(1)
              expect(result).to.have.property('root', root)
              expect(result).to.have.property('size').eq(size)
              expect(result).to.have.nested.property('task.root', root)

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
        expect(result).to.have.property('bundle', true)
        expect(result).to.have.property('failure', null)
        expect(result).to.have.property('format').be.oneOf(formats)
        expect(result).to.have.property('messages').be.an('array')
        expect(result).to.have.property('outdir').be.a('string')
        expect(result).to.have.property('outputs').be.an('array')
        expect(result).to.have.property('outputs').be.an('array')
        expect(result.outputs).to.each.have.property('bytes').be.a('number')
        expect(result).to.have.property('root').be.a('string')
        expect(result).to.have.property('size').be.a('number')
        expect(result).to.have.property('task', task).satisfy(isObjectPlain)
        expect(result).to.have.nested.property('task.plugins').be.an('array')
        expect(result).to.have.nested.property('task.plugins').to.not.be.empty

        // Assert build result
        assert(task, fs)(result)
      })
    })

    describe('transpile', () => {
      it.each<[...Params, Assert?]>([
        [
          {
            logLevel: 'silent',
            moduleContext: 'undefined'
          },
          null,
          function assertion(this: void): Fn<[Result], undefined> {
            return assert

            /**
             * @this {void}
             *
             * @param {Result} result
             *  Build result
             * @return {undefined}
             */
            function assert(this: void, result: Result): undefined {
              /**
               * Module format.
               *
               * @const {Format} format
               */
              const format: Format = result.format

              /**
               * Output directory.
               *
               * @const {string} outdir
               */
              const outdir: string = result.outdir

              expect(result).to.have.property('format', 'esm')
              expect(result).to.have.property('messages').of.length(0)
              expect(result).to.have.property('outdir', 'dist')
              expect(result).to.have.property('outputs').of.length(0)
              expect(result).to.have.property('root', pathe.cwd() + pathe.sep)
              expect(result).to.have.property('size', 0)
              expect(result).to.have.nested.property('task.dts', true)
              expect(result).to.have.nested.property('task.format', format)
              expect(result).to.have.nested.property('task.ignore').eql(IGNORE)
              expect(result).to.have.nested.property('task.logLevel', 'silent')
              expect(result).to.have.nested.property('task.outdir', outdir)
              expect(result).to.have.nested.property('task.root', result.root)

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

            return assert

            /**
             * @this {void}
             *
             * @param {Result} result
             *  Build result
             * @return {undefined}
             */
            function assert(this: void, result: Result): undefined {
              /**
               * Module format.
               *
               * @const {Format} format
               */
              const format: Format = result.format

              /**
               * Output directory.
               *
               * @const {string} outdir
               */
              const outdir: string = result.outdir

              expect(result).to.have.property('format', 'cjs')
              expect(result).to.have.property('messages').of.length(0)
              expect(result).to.have.property('outdir', 'dist')
              expect(result).to.have.property('outputs').of.length(0)
              expect(result).to.have.property('pkg').eql({})
              expect(result).to.have.property('root', root)
              expect(result).to.have.property('size', 0)
              expect(result).to.have.nested.property('task.dts', false)
              expect(result).to.have.nested.property('task.format', format)
              expect(result).to.have.nested.property('task.ignore').eql(IGNORE)
              expect(result).to.have.nested.property('task.logLevel', 'info')
              expect(result).to.have.nested.property('task.outdir', outdir)
              expect(result).to.have.nested.property('task.root', root)

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

            return assert

            /**
             * @this {void}
             *
             * @param {Result} result
             *  Build result
             * @return {undefined}
             */
            function assert(this: void, result: Result): undefined {
              expect(result).to.have.property('format', 'cjs')
              expect(result).to.have.property('outputs').of.length(1)
              expect(result).to.have.property('root', root)

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
            return assert

            /**
             * @this {void}
             *
             * @param {Result} result
             *  Build result
             * @return {undefined}
             */
            function assert(this: void, result: Result): undefined {
              expect(result).to.have.property('format', 'esm')
              expect(result).to.have.property('messages').of.length(0)
              expect(result).to.have.property('outputs').of.length(2)
              expect(result).to.have.nested.property('task.dts', false)
              expect(result).to.have.property('timings').to.not.be.null

              return void result
            }
          }
        ],
        [
          {
            input: 'src/*.mts',
            logLevel: 'silent',
            root: '__fixtures__/pkg/reverse',
            tsconfig: 'tsconfig.json'
          },
          null,
          function assertion(this: void): Fn<[Result], undefined> {
            return assert

            /**
             * @this {void}
             *
             * @param {Result} result
             *  Build result
             * @return {undefined}
             */
            function assert(this: void, result: Result): undefined {
              expect(result).to.have.property('format', 'esm')
              expect(result).to.have.property('outputs').of.length(4)
              expect(result.outputs).toMatchSnapshot()

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
        expect(result).to.have.property('bundle', false)
        expect(result).to.have.property('failure', null)
        expect(result).to.have.property('format').be.oneOf(formats)
        expect(result).to.have.property('messages').be.an('array')
        expect(result).to.have.property('outdir').be.a('string')
        expect(result).to.have.property('outputs').be.an('array')
        expect(result).to.have.property('root').be.a('string')
        expect(result).to.have.property('size').be.a('number')
        expect(result).to.have.property('task', task).satisfy(isObjectPlain)
        expect(result).to.have.nested.property('task.plugins').be.an('array')
        expect(result).to.have.nested.property('task.plugins').to.not.be.empty
        expect(result).to.have.property('timings')

        // Expect (attach `bytes` to output assets and chunks)
        if (result.outputs.length) {
          expect(result.outputs).to.each.have.property('bytes').be.a('number')
        }

        // Assert build result
        assert(task, fs)(result)
      })
    })
  })
})
