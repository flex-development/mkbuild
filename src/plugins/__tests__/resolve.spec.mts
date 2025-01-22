/**
 * @file Unit Tests - resolve
 * @module mkbuild/plugins/tests/unit/resolve
 */

import testSubject from '#plugins/resolve'

describe('unit:plugins/resolve', () => {
  it('should return plugin', () => {
    // Arrange
    const result = testSubject()

    // Expect
    expect(result).to.have.property('name', testSubject.PLUGIN_NAME)
    expect(result).toMatchSnapshot()
  })
})
