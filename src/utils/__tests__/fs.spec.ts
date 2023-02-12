/**
 * @file Unit Tests - fs
 * @module mkbuild/utils/tests/unit/fs
 */

import TestSubject from '../fs'

describe('unit:utils/fs', () => {
  describe('#lstat', () => {
    it('should have lstat method', () => {
      expect(TestSubject).to.have.property('lstat').be.a('function')
    })
  })

  describe('#mkdir', () => {
    it('should have mkdir method', () => {
      expect(TestSubject).to.have.property('mkdir').be.a('function')
    })
  })

  describe('#readdir', () => {
    it('should have readdir method', () => {
      expect(TestSubject).to.have.property('readdir').be.a('function')
    })
  })

  describe('#readdirSync', () => {
    it('should have readdirSync method', () => {
      expect(TestSubject).to.have.property('readdirSync').be.a('function')
    })
  })

  describe('#rm', () => {
    it('should have rm method', () => {
      expect(TestSubject).to.have.property('rm').be.a('function')
    })
  })

  describe('#stat', () => {
    it('should have stat method', () => {
      expect(TestSubject).to.have.property('stat').be.a('function')
    })
  })

  describe('#unlink', () => {
    it('should have unlink method', () => {
      expect(TestSubject).to.have.property('unlink').be.a('function')
    })
  })

  describe('#writeFile', () => {
    it('should have writeFile method', () => {
      expect(TestSubject).to.have.property('writeFile').be.a('function')
    })
  })
})
