/**
 * @file Unit Tests - make
 * @module mkbuild/tests/make/unit
 */

import reverse from '#fixtures/pkg/reverse/build.config'
import tribonacci from '#fixtures/pkg/tribonacci/build.config.ts'
import testSubject from '#make'
import type { Report } from '@flex-development/mkbuild'
import {
  constant,
  isObjectPlain,
  type Fn
} from '@flex-development/tutils'

describe('unit:make', () => {
  it.each<[
    ...Parameters<typeof testSubject>,
    Fn<Parameters<typeof testSubject>, Fn<[Report], undefined>>?
  ]>([
    [
      null,
      function assertion(this: void): Fn<[Report], undefined> {
        return assert

        /**
         * @this {void}
         *
         * @param {Report} report
         *  Build report
         * @return {undefined}
         */
        function assert(report: Report): undefined {
          return void expect(report).to.have.property('builds').be.of.length(0)
        }
      }
    ],
    [
      reverse,
      function assertion(this: void): Fn<[Report], undefined> {
        return assert

        /**
         * @this {void}
         *
         * @param {Report} report
         *  Build report
         * @return {undefined}
         */
        function assert(report: Report): undefined {
          expect(report).to.have.property('builds').be.of.length(1)
          expect(report.builds).to.each.have.property('failure', null)

          return void report
        }
      }
    ],
    [
      tribonacci,
      function assertion(this: void): Fn<[Report], undefined> {
        return assert

        /**
         * @this {void}
         *
         * @param {Report} report
         *  Build report
         * @return {undefined}
         */
        function assert(report: Report): undefined {
          expect(report).to.have.property('builds').be.of.length(2)
          expect(report.builds).to.each.have.property('failure', null)

          return void report
        }
      }
    ]
  ])('should return build report (%#)', async (
    config,
    assert = constant(constant(undefined))
  ) => {
    // Act
    const result = await testSubject(config)

    // Expect
    expect(result).to.satisfy(isObjectPlain)
    expect(result).to.have.property('builds').be.an('array')
    expect(result).to.have.property('size').be.a('number')

    // Assert
    assert(config)(result)
  })
})
