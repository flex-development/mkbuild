/**
 * @file Functional Tests - resolveSpecifiers
 * @module mkbuild/utils/tests/functional/resolveSpecifiers
 */

import BUILD_ENTRY_ESM from 'fixtures/build-entry-esm'
import fs from 'node:fs'
import path from 'node:path'
import type { OutputFile, Statement } from 'src/interfaces'
import resolveSpecifier from '../resolve-specifier'
import testSubject from '../resolve-specifiers'

vi.mock('../resolve-specifier', async () => {
  type Actual = typeof import('../resolve-specifier')
  const path: string = '../resolve-specifier'

  const { default: resolveSpecifier } = await vi.importActual<Actual>(path)

  return { default: vi.fn(resolveSpecifier) }
})

describe('functional:utils/resolveSpecifiers', () => {
  const src: string = path.resolve('src/utils/resolve-specifier.ts')
  const contents: string = fs.readFileSync(src, 'utf8')

  describe('noop', () => {
    it('should do nothing if output.contents is empty string', async () => {
      // Act
      await testSubject({ contents: '', src })

      // Expect
      expect(resolveSpecifier).toHaveBeenCalledTimes(0)
    })

    it('should do nothing if output.contents is undefined', async () => {
      // Act
      await testSubject({ contents: undefined, src })

      // Expect
      expect(resolveSpecifier).toHaveBeenCalledTimes(0)
    })

    it('should do nothing if statements is empty array', async () => {
      // Act
      await testSubject({ contents, src }, {}, [])

      // Expect
      expect(resolveSpecifier).toHaveBeenCalledTimes(0)
    })
  })

  describe('resolve', () => {
    it('should resolve specifiers in output.contents', async () => {
      // Arrange
      const output: Pick<OutputFile, 'contents' | 'src'> = { contents, src }
      const statements: Pick<Statement, 'code' | 'specifier'>[] = [
        {
          code: "import { MODULE_EXTENSIONS } from '../config/constants'",
          specifier: '../config/constants'
        },
        {
          code: "import type { BuildEntry, OutputFile } from '../interfaces'",
          specifier: '../interfaces'
        }
      ]

      // Act
      await testSubject(output, BUILD_ENTRY_ESM, statements)

      // Expect
      expect(resolveSpecifier).toHaveBeenCalledTimes(statements.length)
    })
  })
})
