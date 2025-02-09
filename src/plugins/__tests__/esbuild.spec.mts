/**
 * @file Unit Tests - esbuild
 * @module mkbuild/plugins/tests/unit/esbuild
 */

import testSubject from '#plugins/esbuild'

describe('unit:plugins/esbuild', () => {
  it('should return plugin', () => {
    // Arrange
    const result = testSubject({ format: 'esm', treeShaking: false })

    // Expect
    expect(result).to.have.property('name', testSubject.PLUGIN_NAME)
    expect(result).toMatchSnapshot()
  })
})
