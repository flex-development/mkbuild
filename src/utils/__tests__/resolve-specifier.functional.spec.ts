/**
 * @file Functional Tests - resolveSpecifier
 * @module mkbuild/utils/tests/functional/resolveSpecifier
 */

import type { Statement } from '#src/interfaces'
import { resolvePath } from 'mlly'
import path from 'node:path'
import * as pathe from 'pathe'
import testSubject from '../resolve-specifier'

vi.mock('mlly')
vi.mock('pathe')

describe('functional:utils/resolveSpecifier', () => {
  describe('noop', () => {
    const source: string = faker.system.filePath()

    it('should do nothing if specifier is empty string', async () => {
      // Act
      await testSubject({ specifier: '' } as Omit<Statement, 'type'>, source)

      // Expect
      expect(resolvePath).toHaveBeenCalledTimes(0)
      expect(pathe.parse).toHaveBeenCalledTimes(0)
    })

    it('should do nothing if specifier is undefined', async () => {
      // Arrange
      const statement: Statement = {
        code: 'export const foo',
        end: 16,
        specifier: undefined,
        start: 0,
        type: 'declaration'
      }

      // Act
      await testSubject(statement, source)

      // Expect
      expect(resolvePath).toHaveBeenCalledTimes(0)
      expect(pathe.parse).toHaveBeenCalledTimes(0)
    })

    it('should do nothing if specifier is not relative', async () => {
      // Arrange
      const statement: Statement = {
        code: "export * from '#src'",
        end: 20,
        specifier: '#src',
        start: 0,
        type: 'star'
      }

      // Act
      await testSubject(statement, source)

      // Expect
      expect(resolvePath).toHaveBeenCalledTimes(0)
      expect(pathe.parse).toHaveBeenCalledTimes(0)
    })

    it('should do nothing if specifier includes file extension', async () => {
      // Arrange
      const statement: Statement = {
        code: "import('./bar.mjs')",
        end: 31,
        specifier: './bar.mjs',
        start: 18,
        type: 'dynamic'
      }

      // Act
      await testSubject(statement, source)

      // Expect
      expect(resolvePath).toHaveBeenCalledTimes(0)
      expect(pathe.parse).toHaveBeenCalledTimes(0)
    })
  })

  describe('resolve', () => {
    describe('relative', () => {
      it('should resolve relative path to directory', async () => {
        // Arrange
        const source: string = path.resolve('src/index.ts')
        const specifier: string = './interfaces'
        const code: string = `export * from '${specifier}'`
        const statement: Omit<Statement, 'type'> = {
          code,
          end: code.length,
          specifier,
          start: 0
        }

        // Act
        await testSubject(statement, source)

        // Expect
        expect(resolvePath).toHaveBeenCalledTimes(1)
        expect(pathe.parse).toHaveBeenCalledTimes(2)
        expect(statement).toMatchSnapshot()
      })

      it('should resolve relative path to file', async () => {
        // Arrange
        const source: string = path.resolve('src/utils/resolve-specifier.ts')
        const specifier: string = '../config/constants'
        const code: string = `const { REQUIRE_REGEX } = require('${specifier}')`
        const statement: Omit<Statement, 'type'> = {
          code,
          end: code.length,
          specifier,
          start: 0
        }

        // Act
        await testSubject(statement, source, 'cjs', '.cjs')

        // Expect
        expect(resolvePath).toHaveBeenCalledTimes(1)
        expect(pathe.parse).toHaveBeenCalledTimes(2)
        expect(statement).toMatchSnapshot()
      })
    })
  })
})
