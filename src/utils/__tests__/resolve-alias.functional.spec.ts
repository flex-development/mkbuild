/**
 * @file Functional Tests - resolveAlias
 * @module mkbuild/utils/tests/functional/resolveAlias
 */

import path from 'node:path'
import * as pathe from 'pathe'
import type { Statement } from 'src/interfaces'
import testSubject from '../resolve-alias'

vi.mock('pathe')

describe('functional:utils/resolveAlias', () => {
  describe('noop', () => {
    const match: string = faker.system.filePath()
    const source: string = faker.system.filePath()

    it('should do nothing if statement.specifier is empty string', () => {
      // Act
      testSubject({ specifier: '' } as Omit<Statement, 'type'>, match, source)

      // Expect
      expect(pathe.dirname).toHaveBeenCalledTimes(0)
      expect(pathe.relative).toHaveBeenCalledTimes(0)
    })

    it('should do nothing if statement.specifier is undefined', () => {
      // Arrange
      const statement: Statement = {
        code: 'export declare const foo',
        end: 24,
        specifier: undefined,
        start: 0,
        type: 'declaration'
      }

      // Act
      testSubject(statement, match, source)

      // Expect
      expect(pathe.dirname).toHaveBeenCalledTimes(0)
      expect(pathe.relative).toHaveBeenCalledTimes(0)
    })

    it('should do nothing if match is empty string', () => {
      // Arrange
      const statement: Statement = {
        code: "import('bar')",
        end: 31,
        specifier: "'bar'",
        start: 18,
        type: 'dynamic'
      }

      // Act
      testSubject(statement, '', source)

      // Expect
      expect(pathe.dirname).toHaveBeenCalledTimes(0)
      expect(pathe.relative).toHaveBeenCalledTimes(0)
    })
  })

  describe('resolve', () => {
    const source: string = path.resolve('src/utils/resolve-alias.ts')

    describe('node_modules', () => {
      it('should resolve alias to module in node_modules directory', () => {
        // Arrange
        const specifier: string = 'foo-package/baz'
        const code: string = `import baz from '${specifier}'`
        const expected: string = 'foo-package/lib/baz'
        const statement: Omit<Statement, 'type'> = {
          code,
          end: code.length,
          specifier,
          start: 0
        }

        // Act
        testSubject(statement, path.resolve('node_modules', expected), source)

        // Expect
        expect(pathe.dirname).toHaveBeenCalledTimes(0)
        expect(pathe.relative).toHaveBeenCalledTimes(0)
        expect(statement.specifier).not.to.equal(specifier)
        expect(statement.specifier).to.equal(expected)
        expect(statement.code).not.to.equal(code)
        expect(statement.code).to.contain(expected)
      })
    })

    describe('relative', () => {
      it('should resolve alias to module in different directory', () => {
        // Arrange
        const specifier: string = '#mixins/baz'
        const code: string = `import baz from '${specifier}'`
        const expected: string = '../mixins/baz'
        const statement: Omit<Statement, 'type'> = {
          code,
          end: code.length,
          specifier,
          start: 0
        }

        // Act
        testSubject(statement, path.resolve('src/mixins/baz'), source)

        // Expect
        expect(pathe.dirname).toHaveBeenCalledOnce()
        expect(pathe.relative).toHaveBeenCalledOnce()
        expect(statement.specifier).not.to.equal(specifier)
        expect(statement.specifier).to.equal(expected)
        expect(statement.code).not.to.equal(code)
        expect(statement.code).to.contain(expected)
      })

      it('should resolve alias to module in same directory', () => {
        // Arrange
        const match: string = path.resolve('src/foo')
        const source: string = path.resolve('src/index.ts')
        const specifier: string = '#foo'
        const code: string = `export * from '${specifier}'`
        const expected: string = './foo'
        const statement: Omit<Statement, 'type'> = {
          code,
          end: code.length,
          specifier,
          start: 0
        }

        // Act
        testSubject(statement, match, source)

        // Expect
        expect(pathe.dirname).toHaveBeenCalledOnce()
        expect(pathe.relative).toHaveBeenCalledOnce()
        expect(statement.specifier).not.to.equal(specifier)
        expect(statement.specifier).to.equal(expected)
        expect(statement.code).not.to.equal(code)
        expect(statement.code).to.contain(expected)
      })
    })
  })
})
