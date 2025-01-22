/**
 * @file E2E Tests - api
 * @module mkbuild/tests/e2e/api
 */

import * as testSubject from '@flex-development/mkbuild'

describe('e2e:mkbuild', () => {
  it('should expose public api', () => {
    expect(Object.keys(testSubject)).toMatchSnapshot()
  })
})
