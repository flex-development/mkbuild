/**
 * @file Unit Tests - write
 * @module mkbuild/plugins/tests/unit/write
 */

import testSubject from '#plugins/write'

describe('unit:plugins/write', () => {
  it('should return plugin', () => {
    // Arrange
    const result = testSubject()

    // Expect
    expect(result).to.have.property('name', testSubject.PLUGIN_NAME)
    expect(result).toMatchSnapshot()
  })
})
