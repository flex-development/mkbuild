/**
 * @file Unit Tests - defineBuildConfig
 * @module mkbuild/utils/tests/unit/defineBuildConfig
 */

import testSubject from '../define-build-config'

describe('unit:utils/defineBuildConfig', () => {
  it('should return build config object', () => {
    expect(testSubject({ entries: [] })).to.eql({ entries: [] })
  })
})
