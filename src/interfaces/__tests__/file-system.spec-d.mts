/**
 * @file Type Tests - FileSystem
 * @module mlly/interfaces/tests/unit-d/FileSystem
 */

import type TestSubject from '#interfaces/file-system'
import type { Awaitable, ModuleId } from '@flex-development/mlly'
import type * as tscu from '@flex-development/tsconfig-utils'

describe('unit-d:interfaces/FileSystem', () => {
  it('should extend tscu.FileSystem', () => {
    expectTypeOf<TestSubject>().toMatchTypeOf<tscu.FileSystem>()
  })

  describe('mkdir', () => {
    type Subject = TestSubject['mkdir']

    it('should match [this: void]', () => {
      expectTypeOf<Subject>().thisParameter.toEqualTypeOf<void>()
    })

    describe('parameters', () => {
      it('should be callable with [ModuleId, ({ recursive: true } | undefined)?]', () => {
        expectTypeOf<Subject>()
          .parameters
          .toEqualTypeOf<[ModuleId, ({ recursive: true } | undefined)?]>()
      })
    })

    describe('returns', () => {
      it('should return Awaitable<string | null | undefined | void>', () => {
        expectTypeOf<Subject>()
          .returns
          .toEqualTypeOf<Awaitable<string | null | undefined | void>>()
      })
    })
  })

  describe('mkdirSync', () => {
    type Subject = TestSubject['mkdirSync']

    it('should match [this: void]', () => {
      expectTypeOf<Subject>().thisParameter.toEqualTypeOf<void>()
    })

    describe('parameters', () => {
      it('should be callable with [ModuleId]', () => {
        expectTypeOf<Subject>().parameters.toEqualTypeOf<[ModuleId]>()
      })
    })

    describe('returns', () => {
      it('should return string | null | undefined | void', () => {
        expectTypeOf<Subject>()
          .returns
          .toEqualTypeOf<string | null | undefined | void>()
      })
    })
  })

  describe('rm', () => {
    type Subject = TestSubject['rm']

    it('should match [this: void]', () => {
      expectTypeOf<Subject>().thisParameter.toEqualTypeOf<void>()
    })

    describe('parameters', () => {
      it('should be callable with [string, { force: true; recursive: true }]', () => {
        expectTypeOf<Subject>()
          .parameters
          .toEqualTypeOf<[string, { force: true; recursive: true }]>()
      })
    })

    describe('returns', () => {
      it('should return Awaitable<null | undefined | void>', () => {
        expectTypeOf<Subject>()
          .returns
          .toEqualTypeOf<Awaitable<null | undefined | void>>()
      })
    })
  })

  describe('writeFile', () => {
    type Subject = TestSubject['writeFile']

    it('should match [this: void]', () => {
      expectTypeOf<Subject>().thisParameter.toEqualTypeOf<void>()
    })

    describe('parameters', () => {
      it('should be callable with [string, string]', () => {
        expectTypeOf<Subject>().parameters.toEqualTypeOf<[string, string]>()
      })
    })

    describe('returns', () => {
      it('should return Awaitable<null | undefined | void>', () => {
        expectTypeOf<Subject>()
          .returns
          .toEqualTypeOf<Awaitable<null | undefined | void>>()
      })
    })
  })
})
