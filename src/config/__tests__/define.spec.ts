/**
 * @file Unit Tests - defineBuildConfig
 * @module mkbuild/config/tests/unit/defineBuildConfig
 */

import testSubject from '../define'

describe('unit:config/defineBuildConfig', () => {
  it('should return build config object', () => {
    expect(testSubject({ entries: [] })).to.deep.equal({ entries: [] })
  })
})
