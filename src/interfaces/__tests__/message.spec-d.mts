/**
 * @file Type Tests - Message
 * @module mkbuild/interfaces/tests/unit-d/Message
 */

import type TestSubject from '#interfaces/message'
import type {
  LogType,
  MessageLocation,
  RollupCode
} from '@flex-development/mkbuild'
import type { Nilable } from '@flex-development/tutils'

describe('unit-d:interfaces/Message', () => {
  it('should match [binding?: string | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('binding')
      .toEqualTypeOf<Nilable<string>>()
  })

  it('should match [cause?: unknown]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('cause').toEqualTypeOf<unknown>()
  })

  it('should match [code?: RollupCode | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('code')
      .toEqualTypeOf<Nilable<RollupCode>>()
  })

  it('should match [exporter?: string | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('exporter')
      .toEqualTypeOf<Nilable<string>>()
  })

  it('should match [frame?: string | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('frame')
      .toEqualTypeOf<Nilable<string>>()
  })

  it('should match [hook?: string | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('hook')
      .toEqualTypeOf<Nilable<string>>()
  })

  it('should match [id?: string | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('id')
      .toEqualTypeOf<Nilable<string>>()
  })

  it('should match [ids?: string[] | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('ids')
      .toEqualTypeOf<Nilable<string[]>>()
  })

  it('should match [loc?: MessageLocation | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('loc')
      .toEqualTypeOf<Nilable<MessageLocation>>()
  })

  it('should match [level: LogType]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('level').toEqualTypeOf<LogType>()
  })

  it('should match [message: string]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('message')
      .toEqualTypeOf<string>()
  })

  it('should match [meta?: unknown]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('meta').toEqualTypeOf<unknown>()
  })

  it('should match [names?: string[] | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('names')
      .toEqualTypeOf<Nilable<string[]>>()
  })

  it('should match [plugin?: string | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('plugin')
      .toEqualTypeOf<Nilable<string>>()
  })

  it('should match [pluginCode?: unknown]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('pluginCode')
      .toEqualTypeOf<unknown>()
  })

  it('should match [pos?: number | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('pos')
      .toEqualTypeOf<Nilable<number>>()
  })

  it('should match [reexporter?: string | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('reexporter')
      .toEqualTypeOf<Nilable<string>>()
  })

  it('should match [stack?: string | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('stack')
      .toEqualTypeOf<Nilable<string>>()
  })

  it('should match [url?: string | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('url')
      .toEqualTypeOf<Nilable<string>>()
  })
})
