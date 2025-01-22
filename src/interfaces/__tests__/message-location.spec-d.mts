/**
 * @file Type Tests - MessageLocation
 * @module mkbuild/interfaces/tests/unit-d/MessageLocation
 */

import type TestSubject from '#interfaces/message-location'
import type { Optional } from '@flex-development/tutils'
import type { Point } from '@flex-development/vfile-location'

describe('unit-d:interfaces/MessageLocation', () => {
  it('should extend Omit<Point, "offset">', () => {
    expectTypeOf<TestSubject>().toMatchTypeOf<Omit<Point, 'offset'>>()
  })

  it('should match [file?: string | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('file')
      .toEqualTypeOf<Optional<string>>()
  })
})
