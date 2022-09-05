/**
 * @file Functional Tests - resolveSpecifier
 * @module mkbuild/utils/tests/functional/resolveSpecifier
 */

import BUILD_ENTRY_CJS from 'fixtures/build-entry-cjs'
import BUILD_ENTRY_ESM from 'fixtures/build-entry-esm'
import { resolvePath } from 'mlly'
import path from 'node:path'
import * as pathe from 'pathe'
import type { BuildEntry, Statement } from 'src/interfaces'
import testSubject from '../resolve-specifier'

vi.mock('mlly', async () => {
  type Actual = typeof import('mlly')
  const path: string = 'mlly'

  const { resolvePath } = await vi.importActual<Actual>(path)

  return { resolvePath: vi.fn(resolvePath) }
})

vi.mock('pathe')

describe('functional:utils/resolveSpecifier', () => {
  const src: string = path.resolve('src/utils/resolve-specifier.ts')
  const specifier: string = '../config/constants'
  const code: string = `import { MODULE_EXTENSIONS } from '${specifier}'`

  describe('noop', () => {
    const statement: Pick<Statement, 'code' | 'specifier'> = {
      code,
      specifier
    }

    it('should do nothing if entry.ext is undefined', async () => {
      // Arrange
      const entry: Pick<BuildEntry, 'ext' | 'format'> = {
        ext: undefined,
        format: BUILD_ENTRY_ESM.format
      }

      // Act
      await testSubject(statement, entry, src)

      // Expect
      expect(resolvePath).toHaveBeenCalledTimes(0)
      expect(pathe.parse).toHaveBeenCalledTimes(0)
    })

    it('should do nothing if entry.format is undefined', async () => {
      // Arrange
      const entry: Pick<BuildEntry, 'ext' | 'format'> = {
        ext: BUILD_ENTRY_ESM.ext,
        format: undefined
      }

      // Act
      await testSubject(statement, entry, src)

      // Expect
      expect(resolvePath).toHaveBeenCalledTimes(0)
      expect(pathe.parse).toHaveBeenCalledTimes(0)
    })

    it('should do nothing if statement.specifier is empty string', async () => {
      // Arrange
      const statement: Pick<Statement, 'code' | 'specifier'> = {
        code,
        specifier: ''
      }

      // Act
      await testSubject(statement, BUILD_ENTRY_ESM, src)

      // Expect
      expect(resolvePath).toHaveBeenCalledTimes(0)
      expect(pathe.parse).toHaveBeenCalledTimes(0)
    })

    it('should do nothing if statement.specifier is undefined', async () => {
      // Arrange
      const statement: Pick<Statement, 'code' | 'specifier'> = {
        code,
        specifier: undefined
      }

      // Act
      await testSubject(statement, BUILD_ENTRY_ESM, src)

      // Expect
      expect(resolvePath).toHaveBeenCalledTimes(0)
      expect(pathe.parse).toHaveBeenCalledTimes(0)
    })

    it('should do nothing if statement.specifier is not relative', async () => {
      // Arrange
      const specifier: string = '@flex-development/tutils/dist/enums/node-env'
      const statement: Pick<Statement, 'code' | 'specifier'> = {
        code: `import NodeEnv from '${specifier}'`,
        specifier
      }

      // Act
      await testSubject(statement, BUILD_ENTRY_ESM, src)

      // Expect
      expect(resolvePath).toHaveBeenCalledTimes(0)
      expect(pathe.parse).toHaveBeenCalledTimes(0)
    })

    it('should do nothing if statement.specifier includes ext', async () => {
      // Arrange
      const specifier: string = './interfaces/index.mjs'
      const statement: Pick<Statement, 'code' | 'specifier'> = {
        code: `import type { OutputFile, Statement } from '${specifier}'`,
        specifier
      }

      // Act
      await testSubject(statement, BUILD_ENTRY_ESM, src)

      // Expect
      expect(resolvePath).toHaveBeenCalledTimes(0)
      expect(pathe.parse).toHaveBeenCalledTimes(0)
    })
  })

  describe('resolve', () => {
    describe('relative', () => {
      it('should resolve relative path to directory', async () => {
        // Arrange
        const src: string = path.resolve('src/index.ts')
        const specifier: string = './interfaces'
        const statement: Pick<Statement, 'code' | 'specifier'> = {
          code: `export * from '${specifier}'`,
          specifier
        }

        // Act
        await testSubject(statement, BUILD_ENTRY_ESM, src)

        // Expect
        expect(resolvePath).toHaveBeenCalledTimes(1)
        expect(pathe.parse).toHaveBeenCalledTimes(2)
        expect(statement.specifier).not.to.equal(specifier)
        expect(statement.specifier).to.equal('./interfaces/index.mjs')
        expect(statement.code).to.contain(statement.specifier)
      })

      it('should resolve relative path to module', async () => {
        // Arrange
        const statement: Pick<Statement, 'code' | 'specifier'> = {
          code: `const { MODULE_EXTENSIONS } = require('${specifier}')`,
          specifier
        }

        // Act
        await testSubject(statement, BUILD_ENTRY_CJS, src)

        // Expect
        expect(resolvePath).toHaveBeenCalledTimes(1)
        expect(pathe.parse).toHaveBeenCalledTimes(2)
        expect(statement.specifier).not.to.equal(specifier)
        expect(statement.specifier).to.equal('../config/constants.cjs')
        expect(statement.code).to.contain(statement.specifier)
      })
    })
  })
})
