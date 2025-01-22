/**
 * @file Unit Tests - clean
 * @module mkbuild/plugins/tests/unit/clean
 */

import testSubject from '#plugins/clean'

describe('unit:plugins/clean', () => {
  it('should return plugin', () => {
    // Arrange
    const result = testSubject()

    // Expect
    expect(result).to.have.property('name', testSubject.PLUGIN_NAME)
    expect(result).toMatchSnapshot()
  })
})
