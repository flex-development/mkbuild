/**
 * @file Functional Tests - resolveAliases
 * @module mkbuild/utils/tests/functional/resolveAliases
 */

import { findStaticImports, type StaticImport } from 'mlly'
import fs from 'node:fs'
import path from 'node:path'
import type { OutputFile } from 'src/interfaces'
import { createMatchPath, loadConfig } from 'tsconfig-paths'
import resolveAlias from '../resolve-alias'
import testSubject from '../resolve-aliases'

vi.mock('pathe')

vi.mock('tsconfig-paths', async () => {
  type Actual = typeof import('tsconfig-paths')
  const path: string = 'tsconfig-paths'

  const { createMatchPath, loadConfig } = await vi.importActual<Actual>(path)

  return {
    createMatchPath: vi.fn(createMatchPath),
    loadConfig: vi.fn(loadConfig)
  }
})

vi.mock('../resolve-alias', async () => {
  type Actual = typeof import('../resolve-alias')
  const path: string = '../resolve-alias'

  const { default: resolveAlias } = await vi.importActual<Actual>(path)

  return { default: vi.fn(resolveAlias) }
})

describe('functional:utils/resolveAliases', () => {
  const src: string = path.resolve('src/utils/resolve-alias.ts')
  const contents: string = fs.readFileSync(src, 'utf8')

  describe('noop', () => {
    it('should do nothing if output.contents is empty string', async () => {
      // Act
      await testSubject({ contents: '', src })

      // Expect
      expect(loadConfig).toHaveBeenCalledTimes(0)
      expect(createMatchPath).toHaveBeenCalledTimes(0)
      expect(resolveAlias).toHaveBeenCalledTimes(0)
    })

    it('should do nothing if output.contents is undefined', async () => {
      // Act
      await testSubject({ contents: undefined, src })

      // Expect
      expect(loadConfig).toHaveBeenCalledTimes(0)
      expect(createMatchPath).toHaveBeenCalledTimes(0)
      expect(resolveAlias).toHaveBeenCalledTimes(0)
    })

    it('should do nothing if statements is empty array', async () => {
      // Act
      await testSubject({ contents, src }, [])

      // Expect
      expect(loadConfig).toHaveBeenCalledTimes(0)
      expect(createMatchPath).toHaveBeenCalledTimes(0)
      expect(resolveAlias).toHaveBeenCalledTimes(0)
    })
  })

  describe('resolve', () => {
    it('should resolve path aliases in output.contents', async () => {
      // Arrange
      const output: Pick<OutputFile, 'contents' | 'src'> = { contents, src }
      const statements: StaticImport[] = findStaticImports(contents)

      // Act
      await testSubject(output, statements)

      // Expect
      expect(loadConfig).toHaveBeenCalledTimes(1)
      expect(createMatchPath).toHaveBeenCalledTimes(1)
      expect(resolveAlias).toHaveBeenCalledTimes(statements.length)
    })
  })
})
