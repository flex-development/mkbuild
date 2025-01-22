/**
 * @file Unit Tests - metadata
 * @module mkbuild/plugins/tests/unit/metadata
 */

import testSubject from '#plugins/metadata'

describe('unit:plugins/metadata', () => {
  it('should return plugin', () => {
    // Arrange
    const result = testSubject()

    // Expect
    expect(result).to.have.property('name', testSubject.PLUGIN_NAME)
    expect(result).toMatchSnapshot()
  })
})
