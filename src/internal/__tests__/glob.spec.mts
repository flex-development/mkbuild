/**
 * @file Unit Tests - glob
 * @module mkbuild/internal/tests/unit/glob
 */

import testSubject from '#internal/glob'
import IGNORE_PATTERNS from '#utils/ignore-patterns'
import type { Options } from '@flex-development/fst-util-from-fs'
import pathe from '@flex-development/pathe'
import { constant, type Fn } from '@flex-development/tutils'
import { ok } from 'devlop'

describe('unit:internal/glob', () => {
  it.each<[
    ...Parameters<typeof testSubject>,
    Fn<Parameters<typeof testSubject>, Fn<[readonly string[]], undefined>>?
  ]>([
    [
      null,
      function assertion(this: void): Fn<[readonly string[]], undefined> {
        return assert

        /**
         * @this {void}
         *
         * @param {ReadonlyArray<string>} files
         *  List of matched files
         * @return {undefined}
         */
        function assert(this: void, files: readonly string[]): undefined {
          return void expect(files).to.be.of.length(0)
        }
      }
    ],
    [
      {
        ignore: '**/package.json',
        include: '**',
        root: '__fixtures__/pkg/browser-usage'
      },
      function assertion(
        this: void,
        options?: Options | null | undefined
      ): Fn<[readonly string[]], undefined> {
        return assert

        /**
         * @this {void}
         *
         * @param {ReadonlyArray<string>} files
         *  List of matched files
         * @return {undefined}
         */
        function assert(this: void, files: readonly string[]): undefined {
          ok(options, 'expected `options`')
          ok(typeof options.root === 'string', 'expected `options.root`')

          expect(files).to.be.of.length(1)
          expect(files).to.each.have.dirname(options.root)

          return void files
        }
      }
    ],
    [
      {
        ignore: IGNORE_PATTERNS,
        include: [
          '!src/internal/*.d.mts',
          'src/*.mts',
          'src/internal/*.mts',
          'src/plugins/*.mts',
          'src/utils/*.mts'
        ]
      },
      function assertion(this: void): Fn<[readonly string[]], undefined> {
        /**
         * Regular expression matching ignored files.
         *
         * @const {RegExp} ignored
         */
        const ignored: RegExp = /\/src\/internal\/.*\.d\.mts$/

        return assert

        /**
         * @this {void}
         *
         * @param {ReadonlyArray<string>} files
         *  List of matched files
         * @return {undefined}
         */
        function assert(this: void, files: readonly string[]): undefined {
          expect(files).to.have.property('length').gt(0)
          expect(files).to.each.satisfy(pathe.isAbsolute)
          expect(files).to.each.startWith(pathe.resolve('src') + pathe.sep)
          expect(files).to.each.not.match(ignored)

          return void files
        }
      }
    ]
  ])('should return list of matched files (%#)', (
    options,
    assert = constant(constant(undefined))
  ) => {
    // Act
    const result = testSubject(options)

    // Expect
    expect(result).to.be.an('array')

    // Assert
    assert(options)(result)
  })
})
