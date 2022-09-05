/**
 * @file Functional Tests - resolveAlias
 * @module mkbuild/utils/tests/functional/resolveAlias
 */

import path from 'node:path'
import * as pathe from 'pathe'
import type { Statement } from 'src/interfaces'
import type { MatchPath } from 'tsconfig-paths'
import {
  createMatchPath,
  loadConfig,
  type ConfigLoaderSuccessResult
} from 'tsconfig-paths'
import testSubject from '../resolve-alias'

vi.mock('pathe')

describe('functional:utils/resolveAlias', () => {
  const src: string = path.resolve('src/utils/resolve-alias.ts')
  const specifier: string = 'src/interfaces'
  const code: string = `import type { OutputFile } from '${specifier}'`

  describe('noop', () => {
    const matcher: MatchPath = vi.fn().mockName('matcher')

    it('should do nothing if statement.specifier is empty string', () => {
      // Act
      testSubject({ code, specifier: '' }, src, matcher)

      // Expect
      expect(matcher).toHaveBeenCalledTimes(0)
      expect(pathe.dirname).toHaveBeenCalledTimes(0)
      expect(pathe.relative).toHaveBeenCalledTimes(0)
    })

    it('should do nothing if statement.specifier is undefined', () => {
      // Act
      testSubject({ code, specifier: undefined }, src, matcher)

      // Expect
      expect(matcher).toHaveBeenCalledTimes(0)
      expect(pathe.dirname).toHaveBeenCalledTimes(0)
      expect(pathe.relative).toHaveBeenCalledTimes(0)
    })

    it('should do nothing if matcher returns undefined', () => {
      // Act
      testSubject({ code, specifier: './interfaces' }, src, matcher)

      // Expect
      expect(pathe.dirname).toHaveBeenCalledTimes(0)
      expect(pathe.relative).toHaveBeenCalledTimes(0)
    })
  })

  describe('resolve', () => {
    const tsconfig = loadConfig(process.cwd()) as ConfigLoaderSuccessResult

    const matcher: MatchPath = createMatchPath(
      tsconfig.absoluteBaseUrl,
      tsconfig.paths,
      tsconfig.mainFields,
      tsconfig.addMatchAll
    )

    describe('node_modules', () => {
      it('should resolve alias to module in node_modules directory', () => {
        // Arrange
        const expected: string = '@flex-development/tutils/dist/enums/node-env'
        const specifier: string = '@flex-development/tutils/enums/node-env'
        const statement: Pick<Statement, 'code' | 'specifier'> = {
          code: `import NodeEnv from '${specifier}'`,
          specifier
        }

        // Act
        testSubject(statement, src, matcher)

        // Expect
        expect(pathe.dirname).toHaveBeenCalledTimes(0)
        expect(pathe.relative).toHaveBeenCalledTimes(0)
        expect(statement.specifier).not.to.equal(specifier)
        expect(statement.specifier).to.equal(expected)
        expect(statement.code).not.to.contain(specifier)
        expect(statement.code).to.contain(expected)
      })
    })

    describe('relative', () => {
      it('should resolve alias to module in different directory', () => {
        // Arrange
        const statement: Pick<Statement, 'code' | 'specifier'> = {
          code,
          specifier
        }

        // Act
        testSubject(statement, src, matcher)

        // Expect
        expect(pathe.dirname).toHaveBeenCalledOnce()
        expect(pathe.relative).toHaveBeenCalledOnce()
        expect(statement.specifier).not.to.equal(specifier)
        expect(statement.specifier).to.equal('../interfaces')
        expect(statement.code).not.to.contain(specifier)
        expect(statement.code).to.contain(statement.specifier)
      })

      it('should resolve alias to module in same directory', () => {
        // Arrange
        const specifier: string = 'src/config/constants'
        const statement: Pick<Statement, 'code' | 'specifier'> = {
          code: `export * from '${specifier}'`,
          specifier
        }

        // Act
        testSubject(statement, path.resolve('src/index.ts'), matcher)

        // Expect
        expect(pathe.dirname).toHaveBeenCalledOnce()
        expect(pathe.relative).toHaveBeenCalledOnce()
        expect(statement.specifier).not.to.equal(specifier)
        expect(statement.specifier).to.equal('./config/constants')
        expect(statement.code).not.to.contain(specifier)
        expect(statement.code).to.contain(statement.specifier)
      })
    })
  })
})
