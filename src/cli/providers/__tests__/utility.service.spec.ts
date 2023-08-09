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
      expect(subject.parseList('import,node')).to.eql(mlly.CONDITIONS)
    })

    it('should return single-item list as Set', () => {
      // Arrange
      const list: string = 'import'

      // Act + Expect
      expect(subject.parseList(list)).to.eql(new Set<string>([list]))
    })
  })

  describe('#parseObject', () => {
    it('should return empty object if val is not key/value pair list', () => {
      expect(subject.parseObject('import,node,default')).to.eql({})
    })

    it('should return val as object', () => {
      // Arrange
      const list: string = 'customRenaming_:cR_,disabledRenaming_:false'

      // Act + Expect
      expect(subject.parseObject(list)).to.eql({
        customRenaming_: 'cR_',
        disabledRenaming_: false
      })
    })
  })

  describe('#parseRegExp', () => {
    it('should return empty regular expression if val is invalid', () => {
      expect(subject.parseRegExp('foo').source).to.equal('(?:)')
    })

    it('should return regular expression', () => {
      expect(subject.parseRegExp('/_$/gm')).toMatchObject({
        flags: 'gm',
        source: '_$'
      })
    })
  })
})
