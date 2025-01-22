/**
 * @file Unit Tests - dts
 * @module mkbuild/plugins/tests/unit/dts
 */

import testSubject from '#plugins/dts'

describe('unit:plugins/dts', () => {
  it('should return plugin', () => {
    // Arrange
    const result = testSubject({})

    // Expect
    expect(result).to.have.property('name', testSubject.PLUGIN_NAME)
    expect(result).toMatchSnapshot()
  })
})
