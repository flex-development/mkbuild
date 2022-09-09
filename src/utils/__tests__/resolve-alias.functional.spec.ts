/**
 * @file Functional Tests - resolveAlias
 * @module mkbuild/utils/tests/functional/resolveAlias
 */

import type { Statement } from '#src/interfaces'
import path from 'node:path'
import * as pathe from 'pathe'
import testSubject from '../resolve-alias'

vi.mock('pathe')

describe('functional:utils/resolveAlias', () => {
  describe('noop', () => {
    const match: string = faker.system.filePath()
    const source: string = faker.system.filePath()

    it('should do nothing if specifier is empty string', () => {
      // Act
      testSubject({ specifier: '' } as Omit<Statement, 'type'>, match, source)

      // Expect
      expect(pathe.dirname).toHaveBeenCalledTimes(0)
      expect(pathe.relative).toHaveBeenCalledTimes(0)
    })

    it('should do nothing if specifier is undefined', () => {
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
        const specifier: string = '@flex-development/tutils/enums/node-env'
        const code: string = `import NodeEnv from '${specifier}'`
        const expected: string = '@flex-development/tutils/dist/enums/node-env'
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
        expect(statement).toMatchSnapshot()
      })
    })

    describe('relative', () => {
      it('should resolve alias to module in current directory', () => {
        // Arrange
        const specifier: string = '#src/utils/foobar'
        const code: string = `import { foo } from '${specifier}'`
        const statement: Omit<Statement, 'type'> = {
          code,
          end: code.length,
          specifier,
          start: 0
        }

        // Act
        testSubject(statement, path.resolve('src/utils/foobar'), source)

        // Expect
        expect(pathe.dirname).toHaveBeenCalledOnce()
        expect(pathe.relative).toHaveBeenCalledOnce()
        expect(statement).toMatchSnapshot()
      })

      it('should resolve alias to module in different directory', () => {
        // Arrange
        const specifier: string = '#src/interfaces'
        const code: string = `import type { Statement } from '${specifier}'`
        const statement: Omit<Statement, 'type'> = {
          code,
          end: code.length,
          specifier,
          start: 0
        }

        // Act
        testSubject(statement, path.resolve('src/interfaces'), source)

        // Expect
        expect(pathe.dirname).toHaveBeenCalledOnce()
        expect(pathe.relative).toHaveBeenCalledOnce()
        expect(statement).toMatchSnapshot()
      })
    })
  })
})
