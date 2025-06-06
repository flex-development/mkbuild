/**
 * @file Type Tests - Result
 * @module mkbuild/interfaces/tests/unit-d/Result
 */

import type TestSubject from '#interfaces/result'
import type { Logger } from '@flex-development/log'
import type {
  Failure,
  Format,
  Message,
  OutputAsset,
  OutputChunk,
  RunnableTask
} from '@flex-development/mkbuild'
import type { Nilable } from '@flex-development/tutils'
import type { SerializedTimings } from 'rollup'

describe('unit-d:interfaces/Result', () => {
  it('should match [bundle: boolean]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('bundle')
      .toEqualTypeOf<boolean>()
  })

  it('should match [failure?: Failure | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('failure')
      .toEqualTypeOf<Nilable<Failure>>()
  })

  it('should match [format: Format]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('format').toEqualTypeOf<Format>()
  })

  it('should match [logger: Logger]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('logger').toEqualTypeOf<Logger>()
  })

  it('should match [messages: Message[]]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('messages')
      .toEqualTypeOf<Message[]>()
  })

  it('should match [outdir: string]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('outdir').toEqualTypeOf<string>()
  })

  it('should match [outputs: (OutputAsset | OutputChunk)[]]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('outputs')
      .toEqualTypeOf<(OutputAsset | OutputChunk)[]>()
  })

  it('should match [root: string]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('root').toEqualTypeOf<string>()
  })

  it('should match [size: number]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('size').toEqualTypeOf<number>()
  })

  it('should match [task: Omit<RunnableTask, "run">]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('task')
      .toEqualTypeOf<Omit<RunnableTask, 'run'>>()
  })

  it('should match [timings?: SerializedTimings | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('timings')
      .toEqualTypeOf<Nilable<SerializedTimings>>()
  })
})
