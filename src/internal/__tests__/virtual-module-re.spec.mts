/**
 * @file Unit Tests - VIRTUAL_MODULE_RE
 * @module mkbuild/internal/tests/unit/VIRTUAL_MODULE_RE
 */

import TEST_SUBJECT from '#internal/virtual-module-re'

describe('unit:internal/VIRTUAL_MODULE_RE', () => {
  it.each<string>([
    '\0virtual:my-module',
    'virtual:my-module'
  ])('should match virtual modules naming convention (%j)', id => {
    expect(TEST_SUBJECT.test(id)).to.be.true
  })
})
