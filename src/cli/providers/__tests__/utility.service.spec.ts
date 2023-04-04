/**
 * @file Unit Tests - UtilityService
 * @module mkbuild/cli/providers/tests/unit/UtilityService
 */

import * as mlly from '@flex-development/mlly'
import TestSubject from '../utility.service'

describe('unit:cli/providers/UtilityService', () => {
  let subject: TestSubject

  beforeAll(() => {
    subject = new TestSubject()
  })

  describe('#parseList', () => {
    it('should return multi-item list as Set', () => {
      expect(subject.parseList('import,node')).to.deep.equal(mlly.CONDITIONS)
    })

    it('should return single-item list as Set', () => {
      // Arrange
      const list: string = 'import'

      // Act + Expect
      expect(subject.parseList(list)).to.deep.equal(new Set<string>([list]))
    })
  })

  describe('#parseString', () => {
    it('should return string', () => {
      // Arrange
      const string: string = 'esm'

      // Act + Expect
      expect(subject.parseString(string)).to.equal(string)
    })
  })
})
