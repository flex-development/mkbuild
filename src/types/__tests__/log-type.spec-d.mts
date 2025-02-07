/**
 * @file Type Tests - LogType
 * @module mkbuild/types/tests/unit-d/LogType
 */

import type TestSubject from '#types/log-type'
import type { LogLevel } from 'rollup'

describe('unit-d:types/LogType', () => {
  it('should extract "error"', () => {
    expectTypeOf<TestSubject>().extract<'error'>().not.toBeNever()
  })

  it('should extract "trace"', () => {
    expectTypeOf<TestSubject>().extract<'trace'>().not.toBeNever()
  })

  it('should extract "verbose"', () => {
    expectTypeOf<TestSubject>().extract<'verbose'>().not.toBeNever()
  })

  it('should extract rollup.LogLevel', () => {
    expectTypeOf<TestSubject>().extract<LogLevel>().not.toBeNever()
  })
})
