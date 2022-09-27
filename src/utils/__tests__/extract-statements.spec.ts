/**
 * @file Unit Tests - extractStatements
 * @module mkbuild/utils/tests/unit/extractStatements
 */

import testSubject from '../extract-statements'

describe('unit:utils/extractStatements', () => {
  it('should return empty array if code is empty string', () => {
    expect(testSubject('')).to.be.empty
  })

  describe('export', () => {
    it('should return declaration export statement array', () => {
      expect(testSubject("export const foo = 'bar'")).toMatchSnapshot()
    })

    it('should return default export statement array', () => {
      expect(testSubject('export default something')).toMatchSnapshot()
    })

    it('should return named export statement array', () => {
      expect(testSubject('export { bar, baz }')).toMatchSnapshot()
    })

    it('should return star export statement array', () => {
      expect(testSubject("export * from '#src'")).toMatchSnapshot()
    })

    it('should return type export statement array', () => {
      expect(testSubject('export type OrNull<T> = T | null')).toMatchSnapshot()
    })
  })

  describe('import', () => {
    describe('dynamic', () => {
      it('should return dynamic import statement array', () => {
        // Arrange
        const code = "const foo = await import('bar');await import(foo);"

        // Act + Expect
        expect(testSubject(code)).toMatchSnapshot()
      })
    })

    describe('static', () => {
      it('should return default import statement array', () => {
        expect(testSubject("import foo from 'baz'")).toMatchSnapshot()
      })

      it('should return named import statement array', () => {
        expect(testSubject("import { bar } from 'baz'")).toMatchSnapshot()
      })
    })
  })

  describe('require', () => {
    it('should return require statement array', () => {
      expect(testSubject("require('bar')")).toMatchSnapshot()
    })

    it('should return require.resolve statement array', () => {
      expect(testSubject("require.resolve('baz')")).toMatchSnapshot()
    })
  })
})
