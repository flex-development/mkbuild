/**
 * @file Unit Tests - defineBuildConfig
 * @module mkbuild/utils/tests/unit/defineBuildConfig
 */

import testSubject from '#utils/define-build-config'

describe('unit:utils/defineBuildConfig', () => {
  it.each<Parameters<typeof testSubject>>([
    [],
    [{ tasks: [] }]
  ])('should return build configuration object (%#)', config => {
    expect(testSubject(config)).to.eql(config ?? {})
  })
})
